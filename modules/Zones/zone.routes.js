import { Router } from 'express'
import { generateByCategory } from './zone.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

export const zonesRouter = Router()

zonesRouter.post('/', validateToken, generateByCategory)
