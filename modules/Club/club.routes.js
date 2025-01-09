import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createClub, getAllClubs, getClubById } from './club.controller.js'

export const clubsRoutes = Router()

clubsRoutes.get('/', validateToken, getAllClubs)
clubsRoutes.get('/:id', validateToken, getClubById)
clubsRoutes.post('/', validateToken, createClub)
