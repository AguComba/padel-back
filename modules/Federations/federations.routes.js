import { Router } from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import { createFederation, getFederationById, getFederations } from './federations.controller.js'

const router = Router()
export { router as federationsRoutes }

router.get('/', validateToken, getFederations)
router.get('/:id', validateToken, getFederationById)

router.post('/', validateToken, createFederation)
