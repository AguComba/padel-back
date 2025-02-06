import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createTournament, getTournaments, tournementAceptedByPlayer } from './tournament.controller.js'

export const tournamentRouter = Router()

tournamentRouter.post('/', validateToken, createTournament)
tournamentRouter.get('/', validateToken, getTournaments)
tournamentRouter.post('/search', validateToken, tournementAceptedByPlayer)
// tournamentRouter.get('/', validateToken, searchAll)
// tournamentRouter.get('/', validateToken, searchById)
