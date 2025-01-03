import { Router } from 'express'
import { createCity, getAllCities, getCityById, updateCityStatus } from './cities.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

const router = Router()

router.get('/', getAllCities)
router.get('/:id', validateToken, getCityById)
router.post('/', validateToken, createCity)
router.patch('/:id', validateToken, updateCityStatus)

export { router as citiesRoutes }
