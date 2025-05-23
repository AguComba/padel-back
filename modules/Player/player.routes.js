import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import {
    approveAffiliationPlayer,
    createPlayer,
    getPlayerByDni,
    getPlayers,
    getPlayersByCategory,
    getPlayersById,
    getPlayersByIdUser
} from './player.controller.js'

export const playersRouter = Router()

playersRouter.get('/', validateToken, getPlayers)
playersRouter.get('/category/:id', validateToken, getPlayersByCategory)
playersRouter.get('/dni/:dni', validateToken, getPlayerByDni)
playersRouter.get('/user', validateToken, getPlayersByIdUser)
playersRouter.get('/:id', validateToken, getPlayersById)
playersRouter.post('/', validateToken, createPlayer)
playersRouter.put('/:id', validateToken, approveAffiliationPlayer)
