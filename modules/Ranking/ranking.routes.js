import { Router } from 'express'
import { createRanking, getRanking, importRanking } from './ranking.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

export const rankingRouter = Router()

rankingRouter.get('/', validateToken, getRanking)
rankingRouter.post('/import', validateToken, importRanking)
rankingRouter.post('/', validateToken, createRanking)
