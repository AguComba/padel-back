import {Router} from 'express'
import { validateToken } from '../../middlewares/validateToken.js'
import {getDrops} from './drop.controller.js'

export const drop = Router()

drop.get('/', validateToken, getDrops)
drop.post('/confirm', validateToken, getDrops)