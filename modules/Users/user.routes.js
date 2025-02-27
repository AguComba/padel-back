import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { getAllUsers, updateUser } from './user.controller.js'

export const userRoutes = Router()

userRoutes.get('/', validateToken, getAllUsers)
userRoutes.patch('/', validateToken, updateUser)
