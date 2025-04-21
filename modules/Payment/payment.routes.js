import { Router } from 'express'
import {payment, paymentStatus, paymentTask} from './payment.controller.js'
import {validateToken} from '../../middlewares/validateToken.js'

export const paymentRouter = Router()

paymentRouter.post('/', validateToken, payment)
paymentRouter.post('/estado', paymentStatus) // Esta ruta es pública para que Macro pueda notificar el estado del pago
paymentRouter.get('/task', paymentTask)
