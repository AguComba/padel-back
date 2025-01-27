import { Router } from 'express'
import { getRanking } from './ranking.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

export const rankingRouter = Router()

rankingRouter.get('/', validateToken, getRanking)
