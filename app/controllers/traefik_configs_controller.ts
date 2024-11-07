// import type { HttpContext } from '@adonisjs/core/http'
import Raspberry from '#models/raspberry'
import YAML from 'yaml'

interface RouterConfig {
    rule: string;
    service: string;
    entrypoints: string[];
}

interface TraefikConfig {
    http: {
        routers: { [key: string]: RouterConfig };
        services: {
            [key: string]: {
                loadBalancer: string;
            };
        };
    };
}

export default class TraefikConfigsController {
    /**
     * @getTraefikConfig
     * @operationId getTraefikConfig
     * @description Gives Traefik the configuration for reverse proxy
     */
    async getTraefikConfig() {
        // for each active rasp, add it to http->routers
        // for each active rasp, add it to http->services
        const active_rasps = await Raspberry.query().has('ports', '>', 0)
        const traefik_config: TraefikConfig = {
            http: {
                routers: {},
                services: {}
            }
        };
        active_rasps.forEach(rasp => {
            const routerName =  `router-box-${rasp.id}-${rasp.macAddress}`
            const serviceName = `service-box-${rasp.id}-${rasp.macAddress}`
            traefik_config.http.routers[routerName] = {
                rule: `Host(\`box-${rasp.id}-${rasp.macAddress}.nomHote\`)`,
                service: `service-box-${rasp.id}-${rasp.macAddress}.nomHote`,
                entrypoints: ['websecure']
            }
            traefik_config.http.services[serviceName] = {
                loadBalancer: `{servers : [{ url : 'http://box-${rasp.id}-${rasp.macAddress}.nomHote:80' }]}`
            }
        })
        const response = new YAML.Document()
        response.contents = YAML.parseDocument(YAML.stringify(traefik_config)).contents
        return response
    }
}