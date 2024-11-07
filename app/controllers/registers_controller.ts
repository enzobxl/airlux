import { HttpContext } from '@adonisjs/core/http'
import { registerRaspberryValidator } from '#validators/raspberry'

export default class RegistersController {
  /**
   * @postRegister
   * @operationId postRegister
   * @description Register the raspberry and returns a list of assigned ports
   * @requestBody <registerRaspberryValidator>
   */
  async postRegister({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await registerRaspberryValidator.validate(data)
    response.send(payload)
  }
}
