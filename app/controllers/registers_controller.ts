// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import { registerRaspberryValidator } from '#validators/raspberry'

export default class RegistersController {
  /**
   * Either register a new Raspberry, or return the already assigned ports.
   *
   * @param request
   */
  public async get({ request }: HttpContext) {
    const data = request.all()
    const payload = await registerRaspberryValidator.validate(data)

    // 1 -

    return payload
  }
}
