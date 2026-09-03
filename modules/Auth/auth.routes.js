import { Router } from 'express'
import { adminUpdatePassword, login, logout, recoveryPassword, register, restorePassword, updatePassword } from './auth.controller.js'
import { sendEmailUser } from '../Mails/mails.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

const routes = Router()

routes.post('/login', login)
routes.post('/logout', logout)
routes.post('/email', sendEmailUser)
routes.post('/recoveryPass', recoveryPassword)
routes.get('/resetPassword', restorePassword)
routes.patch('/updatePassword', updatePassword)
routes.patch('/adminUpdatePassword', validateToken, adminUpdatePassword)

routes.post('/register', register)

export { routes as authRoutes }
