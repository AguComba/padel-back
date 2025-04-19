import {Router} from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import {getRanking, getRankingByPlayer, importRanking} from './ranking.controller.js'

export const rankingRouter = Router()

rankingRouter.get('/', validateToken, getRanking)
rankingRouter.get('/pointsByPlayer',validateToken, getRankingByPlayer)
rankingRouter.post('/import', validateToken, importRanking)
