import { HttpContext } from '@adonisjs/core/http'
import { registerRaspberryValidator } from '#validators/raspberry'
import Raspberry from '#models/raspberry'

export default class RegistersController {
  /**
   * @postRegister
   * @operationId postRegister
   * @description Register the raspberry and returns a list of assigned ports
   * @requestBody <registerRaspberryValidator>
   */
  async postRegister({ request }: HttpContext) {
    const data = request.all()
    const payload = await registerRaspberryValidator.validate(data)

    // 1 - Check if there already is an entry in DB
    let raspberry = await Raspberry.findBy('mac_address', payload.mac)

    // 1A - If not, create it
    if (raspberry === null) {
      // Check if requested ports are free
      // If they are, give them ot it
      // Else ?

      return {
        port: ['hello'],
      }
    }

    // TODO : tester le port avec un ping

    return {
      ports: raspberry.ports,
    }
  }
}
