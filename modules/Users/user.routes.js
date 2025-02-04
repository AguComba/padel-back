import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { getAllUsers, getUserByDni } from './user.controller.js'

export const userRoutes = Router()

userRoutes.get('/', validateToken, getAllUsers)
