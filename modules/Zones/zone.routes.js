import { Router } from 'express'
import { endZone, generateByCategory, getZones, saveZones } from './zone.controller.js'
import { validateToken } from '../../middlewares/validateToken.js'

export const zonesRouter = Router()

zonesRouter.post('/', validateToken, generateByCategory)
zonesRouter.post('/save', validateToken, saveZones)
zonesRouter.get('/', validateToken, getZones)
zonesRouter.post('/endZone', validateToken, endZone)
