import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createCategory, getCategories, getCategory, statusCategory } from './categories.controller.js'

export const categoriesRoutes = Router()

categoriesRoutes.get('/', validateToken, getCategories)
categoriesRoutes.get('/:id', validateToken, getCategory)

categoriesRoutes.post('/', validateToken, createCategory)
categoriesRoutes.patch('/', validateToken, statusCategory)
