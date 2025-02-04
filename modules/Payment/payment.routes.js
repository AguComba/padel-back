import { Router } from 'express'
import {payment} from './payment.controller.js'

export const paymentRouter = Router()

paymentRouter.get('/', payment)
