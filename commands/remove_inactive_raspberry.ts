import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Raspberry from '#models/raspberry'
import Port from '#models/port'
import { DateTime } from 'luxon'

export default class ReleaseInactivePorts extends BaseCommand {
  static commandName = 'release-inactive-ports'
  static description = 'Called by cronjob to release inactive ports'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const tenMinutesAgo = DateTime.now().minus({ minutes: 10 }).toJSDate()

    const inactiveRaspberries = await Raspberry.query()
      .where('last_ping_at', '<', tenMinutesAgo)
      .has('ports')
    this.logger.info(inactiveRaspberries.length + ' inactive raspberries')
    for (const raspberry of inactiveRaspberries) {
      await Port.query().where('raspberry_id', raspberry.id).update({ raspberry_id: null })
      this.logger.info(raspberry.macAddress + ' associated ports has been released')
    }
  }
}
