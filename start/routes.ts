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
<<<<<<< HEAD
import RegistersController from '#controllers/registers_controller'

// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})
=======
>>>>>>> 2d17164c57cc2718ecceea46d3ae41f755de1387

const PingController = () => import('#controllers/ping_controller')
const RegistersController = () => import('#controllers/registers_controller')

// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

<<<<<<< HEAD
// Register routes
router.get('/register', [RegistersController, 'get'])
=======
// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

router.post('/ping', [PingController, 'postPing'])

// Register routes
router.post('/register', [RegistersController, 'postRegister'])
>>>>>>> 2d17164c57cc2718ecceea46d3ae41f755de1387
