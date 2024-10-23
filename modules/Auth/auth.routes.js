import { Router } from 'express'
import { login, register } from './auth.controller.js'

const routes = Router()

routes.post('/login', login)

routes.post('/register', register)

export { routes as authRoutes }
