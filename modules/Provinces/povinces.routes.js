import { Router } from 'express'
import { getProvinces, getProvinceById } from './provinces.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

const provincesRoutes = Router()

provincesRoutes.get('/', getProvinces)
provincesRoutes.get('/:id', validateToken, getProvinceById)

export { provincesRoutes }
