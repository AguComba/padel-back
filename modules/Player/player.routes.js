import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import {
    createPlayer,
    getPlayerByDni,
    getPlayers,
    getPlayersByCategory,
    getPlayersById,
    getPlayersByIdUser
} from './player.controller.js'

export const playersRouter = Router()

playersRouter.get('/', validateToken, getPlayers)
playersRouter.get('/:id', validateToken, getPlayersById)
playersRouter.get('/user', validateToken, getPlayersByIdUser)
playersRouter.get('/category/:id', validateToken, getPlayersByCategory)
playersRouter.get('/dni/:dni', validateToken, getPlayerByDni)

playersRouter.post('/', validateToken, createPlayer)
