import Raspberry from '#models/raspberry'
import Port from '#models/port'
import PortType from '#models/port_type'

export default class PostService {
  constructor() {}

  async assignAvailablePorts(
    raspberry: Raspberry,
    tcpPorts: Array<string>,
    httpPorts: Array<string>,
    responsePayload: {
      httpPorts: Array<number>
      tcpPorts: Array<number>
    }
  ): Promise<void> {
    let requestedPortsLength = tcpPorts.length + httpPorts.length
    let availablePorts = await Port.query()
      .doesntHave('raspberry')
      .orderBy('portNumber', 'asc')
      .limit(requestedPortsLength)

    let tcpPortType = await PortType.findBy('label', 'tcp')
    let httpPortType = await PortType.findBy('label', 'http')

    // If enough ports are available
    if (availablePorts.length === requestedPortsLength) {
      // Slice the available ports into TCP and HTTP sections
      const tcp = availablePorts.slice(0, tcpPorts.length)
      const http = availablePorts.slice(tcpPorts.length)

      // Assign TCP ports
      tcp.forEach((port) => {
        port.portTypeId = tcpPortType!.id
        port.raspberryId = raspberry!.id
        responsePayload.tcpPorts.push(port.portNumber)
        port.save()
      })

      // Assign HTTP ports
      http.forEach((port) => {
        port.portTypeId = httpPortType!.id
        port.raspberryId = raspberry!.id
        responsePayload.httpPorts.push(port.portNumber)
        port.save()
      })
    }
  }
}
