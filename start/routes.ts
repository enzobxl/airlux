/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import Raspberry from '#models/raspberry'
import Port from '#models/port'

// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/test', async () => {
  const raspberry = await Raspberry.create({
    macAddress: 'azertyuiop',
    sshKey: 'azertyuiopqsdfghjkl',
  })
  const ports = [8080, 3000, 5000]

  for (const portNumber of ports) {
    await Port.create({
      portNumber: portNumber,
      raspberryId: raspberry.id,
    })
  }
  return {
    raspberry,
  }
})
