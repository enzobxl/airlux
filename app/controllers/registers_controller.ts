import { HttpContext } from '@adonisjs/core/http'
import { registerRaspberryValidator } from '#validators/raspberry'
import Raspberry from '#models/raspberry'
import Port from '#models/port'
import PortType from '#models/port_type'
import { DateTime } from 'luxon'

export default class RegistersController {
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

    let raspberry = await Raspberry.findBy('mac_address', payload.mac)
    console.log(payload.mac)

    if (raspberry === null) {
      raspberry = await Raspberry.create({
        macAddress: payload.mac,
        sshKey: payload.key,
      })

      let requestedPortsLength = payload.tcpPorts.length + payload.httpPorts.length
      let availablePorts = await Port.query()
        .doesntHave('raspberry')
        .orderBy('portNumber', 'asc')
        .limit(requestedPortsLength)

      let tcpPortType = await PortType.findBy('label', 'tcp')
      let httpPortType = await PortType.findBy('label', 'http')

      // If enough ports are available
      if (availablePorts.length === requestedPortsLength) {
        // Slice the available ports into TCP and HTTP sections
        const tcpPorts = availablePorts.slice(0, payload.tcpPorts.length)
        const httpPorts = availablePorts.slice(payload.tcpPorts.length)

        // Assign TCP ports
        tcpPorts.forEach((port) => {
          port.portTypeId = tcpPortType!.id
          port.raspberryId = raspberry!.id
          responsePayload.tcpPorts.push(port.portNumber)
          port.save()
        })

        // Assign HTTP ports
        httpPorts.forEach((port) => {
          port.portTypeId = httpPortType!.id
          port.raspberryId = raspberry!.id
          responsePayload.httpPorts.push(port.portNumber)
          port.save()
        })
      }
    } else {
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
    }

    // Update last pinged at
    raspberry.lastPingAt = DateTime.now()
    await raspberry.save()

    return responsePayload
  }
}
