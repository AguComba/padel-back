import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createTournament } from './tournament.controller.js'

export const tournamentRouter = Router()

tournamentRouter.post('/', validateToken, createTournament)
// tournamentRouter.get('/', validateToken, searchActive)
// tournamentRouter.get('/', validateToken, searchAll)
// tournamentRouter.get('/', validateToken, searchById)
