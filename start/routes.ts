/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

const PingController = () => import('#controllers/ping_controller')
const RegistersController = () => import('#controllers/registers_controller')
const TraefikConfigController = () => import('#controllers/traefik_configs_controller')

// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})


// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

router.post('/ping', [PingController, 'postPing'])

// Register routes
router.post('/register', [RegistersController, 'postRegister'])

// Sends the traefik configuration needed for external routers access
router.get('/traefik-config', [TraefikConfigController, 'getTraefikConfig'])