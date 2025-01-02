import { Router } from 'express'
import { createCity, getAllCities, getCityById, updateCityStatus } from './cities.controller.js'

const router = Router()

router.get('/', getAllCities)
router.get('/:id', getCityById)
router.post('/', createCity)
router.patch('/:id', updateCityStatus)

export { router as citiesRoutes }
