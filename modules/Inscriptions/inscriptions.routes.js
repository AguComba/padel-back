import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { validUserInscription } from './inscriptions.controller.js'

export const inscriptionsRouter = Router()

inscriptionsRouter.post('/valid', validateToken, validUserInscription)
