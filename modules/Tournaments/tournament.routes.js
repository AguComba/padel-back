import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createTournament, getAllTournaments, getTournamentById, getTournaments, getTournamentsByPlayer, tournementAceptedByPlayer, updateTournament, visualizationTournament } from './tournament.controller.js'

export const tournamentRouter = Router()

tournamentRouter.post('/', validateToken, createTournament)
tournamentRouter.get('/', validateToken, getTournaments)
tournamentRouter.post('/search', validateToken, tournementAceptedByPlayer)
tournamentRouter.get('/all', validateToken, getAllTournaments)
tournamentRouter.get('/player', validateToken, getTournamentsByPlayer)
tournamentRouter.put('/visualization', validateToken, visualizationTournament)

// Las rutas con :id van al final para que no se coman a /all, /player ni /visualization.
tournamentRouter.get('/:id', validateToken, getTournamentById)
tournamentRouter.put('/:id', validateToken, updateTournament)
