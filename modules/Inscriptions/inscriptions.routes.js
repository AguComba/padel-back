import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createInscriptionCouple } from './inscriptions.controller.js'

export const inscriptionsRouter = Router()

inscriptionsRouter.post('/', validateToken, createInscriptionCouple)
