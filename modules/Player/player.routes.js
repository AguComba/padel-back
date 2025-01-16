import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createPlayer, getPlayers, getPlayersByCategory, getPlayersById } from './player.controller.js'

export const playersRouter = Router()

playersRouter.get('/', validateToken, getPlayers)
playersRouter.get('/:id', validateToken, getPlayersById)
playersRouter.get('/category/:id', validateToken, getPlayersByCategory)

playersRouter.post('/', validateToken, createPlayer)
