import Raspberry from '#models/raspberry'
import { HttpContext } from '@adonisjs/core/http'
import { macAddressValidator } from '#validators/mac_address'
import { DateTime } from 'luxon'

export default class PingController {
  /**
   * @ping
   * @requestBody {"mac": "foo"}
   */
  async ping({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await macAddressValidator.validate(data)
    await Raspberry.query()
      .where('mac_address', payload.mac)
      .update({ last_ping_at: DateTime.now().toISO() })
    response.status(200)
  }
}
