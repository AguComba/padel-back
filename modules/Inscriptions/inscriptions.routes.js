import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createInscriptionCouple, getInscriptionById, getInscriptions, updateInscription } from './inscriptions.controller.js'

export const inscriptionsRouter = Router()

inscriptionsRouter.post('/', validateToken, createInscriptionCouple)
inscriptionsRouter.get('/:id_tournament', validateToken, getInscriptions)
inscriptionsRouter.get('/id/:id_inscription', validateToken, getInscriptionById)
inscriptionsRouter.put('/update/:id_inscription', validateToken, updateInscription)
