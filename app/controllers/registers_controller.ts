import { HttpContext } from '@adonisjs/core/http'
import { registerRaspberryValidator } from '#validators/raspberry'
import Raspberry from '#models/raspberry'
import Port from '#models/port'
import { DateTime } from 'luxon'
import { inject } from '@adonisjs/core'
import PostService from '#services/port_service'

@inject()
export default class RegistersController {
  constructor(protected portService: PostService) {}

  /**
   * @postRegister
   * @operationId postRegister
   * @description Register the raspberry and returns a list of assigned ports
   * @requestBody <registerRaspberryValidator>
   * @responseBody 200 - { "httpPorts": [], "tcpPorts": [] }
   */
  async postRegister({ request }: HttpContext) {
    const data = request.all()
    const payload = await registerRaspberryValidator.validate(data)

    // Initialize response payload
    let responsePayload: {
      httpPorts: Array<number>
      tcpPorts: Array<number>
    } = {
      httpPorts: [],
      tcpPorts: [],
    }

    // Attempt to find a registered raspberry from the mac address
    let raspberry = await Raspberry.findBy('mac_address', payload.mac)

    // If no raspberry was found, register it and assign ports
    if (raspberry === null) {
      raspberry = await Raspberry.create({
        macAddress: payload.mac,
        sshKey: payload.key,
      })

      await this.portService.assignAvailablePorts(
        raspberry,
        payload.tcpPorts,
        payload.httpPorts,
        responsePayload
      )
    } else {
      // Find ports assigned to the raspberry
      let httpPorts = await Port.query()
        .where('raspberryId', raspberry.id)
        .andWhereHas('portType', (query) => {
          query.where('label', 'http')
        })
        .orderBy('portNumber', 'asc')

      responsePayload['httpPorts'] = httpPorts.map((item) => item.portNumber)

      let tcpPorts = await Port.query()
        .where('raspberryId', raspberry.id)
        .andWhereHas('portType', (query) => {
          query.where('label', 'tcp')
        })
        .orderBy('portNumber', 'asc')

      responsePayload['tcpPorts'] = tcpPorts.map((item) => item.portNumber)

      if (httpPorts.length + tcpPorts.length === 0) {
        await this.portService.assignAvailablePorts(
          raspberry,
          payload.tcpPorts,
          payload.httpPorts,
          responsePayload
        )
      }
    }

    // Update last pinged at
    raspberry.lastPingAt = DateTime.now()
    await raspberry.save()

    return responsePayload
  }
}
