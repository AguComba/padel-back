import express from 'express'
import {resultMatchSchema} from './resultMatchSchema.js'

export default function createResultMatchRoutes(registerResultMatchUseCase) {
    const router = express.Router()

    router.post('/', async (req, res) => {
        try {
            const parsed = resultMatchSchema.parse(req.body)

            // Si no viene created_at / updated_at, se los seteamos ahora
            parsed.created_at ??= new Date()
            parsed.updated_at ??= new Date()

            const result = await registerResultMatchUseCase.execute(parsed)

            res.status(201).json({success: true, data: result})
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    success: false,
                    error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
                })
            }

            console.error('Error registrando resultado:', error)
            res.status(500).json({success: false, error: error.message})
        }
    })

    return router
}

