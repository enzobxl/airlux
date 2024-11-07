import { flags, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import PortType from '#models/port_type'
import PortStatus from '#models/port_status'
import Port from '#models/port'

export default class Setup extends BaseCommand {
  static commandName = 'setup'
  static description = 'Create necessary data for the application to run.'

  @flags.boolean()
  declare name: boolean

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('[SETUP] Creating necessary database rows')

    let statuses: Array<string> = ['available', 'unavailable', 'stopped']

    for (const statusLabel of statuses) {
      await PortStatus.create({
        label: statusLabel,
      })
    }

    let types: Array<string> = ['TCP', 'HTTP']

    for (const portType of types) {
      await PortType.create({
        label: portType,
      })
    }

    let availableStatus = await PortStatus.findBy('label', 'available')

    if (availableStatus !== null) {
      for (let i = 49152; i < 65536; i++) {
        await Port.create({
          portNumber: i,
          portStatusId: availableStatus.id,
          portTypeId: null,
          raspberryId: null,
        })

        this.logger.info(`[SETUP] Port ${i} created`)
      }
    }

    this.logger.info('[SETUP] Creation completed')
  }
}
