import { HttpContext } from '@adonisjs/core/http'
import { registerRaspberryValidator } from '#validators/raspberry'
import Raspberry from '#models/raspberry'
import Port from '#models/port'
import { DateTime } from 'luxon'
import { inject } from '@adonisjs/core'
import PostService from '#services/port_service'

import fs from 'node:fs/promises'

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
  async postRegister({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await registerRaspberryValidator.validate(data)

      let responsePayload: {
        httpPorts: Array<number>
        tcpPorts: Array<number>
      } = {
        httpPorts: [],
        tcpPorts: [],
      }

      const filePath = `/var/raspberry-pub-keys/${payload.mac}`

      try {
        await fs.writeFile(filePath, payload.key)
      } catch (err) {
        console.error('Error while writing key file:', err)
        return response.status(500)
      }

      let raspberry = await Raspberry.findBy('mac_address', payload.mac)

      if (!raspberry) {
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
        const httpPorts = await Port.query()
          .where('raspberryId', raspberry.id)
          .andWhereHas('portType', (query) => {
            query.where('label', 'http')
          })
          .orderBy('portNumber', 'asc')

        responsePayload.httpPorts = httpPorts.map((item) => item.portNumber)

        const tcpPorts = await Port.query()
          .where('raspberryId', raspberry.id)
          .andWhereHas('portType', (query) => {
            query.where('label', 'tcp')
          })
          .orderBy('portNumber', 'asc')

        responsePayload.tcpPorts = tcpPorts.map((item) => item.portNumber)

        if (httpPorts.length + tcpPorts.length === 0) {
          await this.portService.assignAvailablePorts(
            raspberry,
            payload.tcpPorts,
            payload.httpPorts,
            responsePayload
          )
        }
      }

      raspberry.lastPingAt = DateTime.now()
      await raspberry.save()

      return responsePayload
    } catch (error) {
      console.error('Error in postRegister:', error)
      return response.status(500)
    }
  }
}
