import { Router } from 'express'
import { generateByCategory } from './zone.controller.js'

export const zonesRouter = Router()

zonesRouter.post('/', generateByCategory)
