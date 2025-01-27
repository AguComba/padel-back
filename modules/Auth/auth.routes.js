import { Router } from 'express'
import { login, logout, register } from './auth.controller.js'

const routes = Router()

routes.post('/login', login)
routes.post('/logout', logout)

routes.post('/register', register)

export { routes as authRoutes }
