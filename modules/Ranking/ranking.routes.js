import {Router} from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import {getRanking, getRankingByPlayer, importRanking, importRankingFromResults} from './ranking.controller.js'

export const rankingRouter = Router()

rankingRouter.get('/', validateToken, getRanking)
rankingRouter.get('/pointsByPlayer',validateToken, getRankingByPlayer)
rankingRouter.post('/import', validateToken, importRanking)
rankingRouter.post('/', validateToken, importRankingFromResults)
