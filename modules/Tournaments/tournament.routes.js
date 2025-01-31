import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createTournament, getTournaments } from './tournament.controller.js'

export const tournamentRouter = Router()

tournamentRouter.post('/', validateToken, createTournament)
tournamentRouter.get('/', validateToken, getTournaments)
// tournamentRouter.get('/', validateToken, searchAll)
// tournamentRouter.get('/', validateToken, searchById)
