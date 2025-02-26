import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createTournament, getAllTournaments, getTournaments, tournementAceptedByPlayer } from './tournament.controller.js'

export const tournamentRouter = Router()

tournamentRouter.post('/', validateToken, createTournament)
tournamentRouter.get('/', validateToken, getTournaments)
tournamentRouter.post('/search', validateToken, tournementAceptedByPlayer)
tournamentRouter.get('/all', validateToken, getAllTournaments)
// tournamentRouter.get('/', validateToken, searchById)
