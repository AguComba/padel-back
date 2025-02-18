import { Router } from 'express'
import { login, logout, recoveryPassword, register, restorePassword } from './auth.controller.js'
import { sendEmailUser } from '../Mails/mails.controller.js'

const routes = Router()

routes.post('/login', login)
routes.post('/logout', logout)
routes.post('/email', sendEmailUser)
routes.post('/recoveryPass', recoveryPassword)
routes.get('/resetPassword', restorePassword)

routes.post('/register', register)

export { routes as authRoutes }
