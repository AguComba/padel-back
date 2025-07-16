import express from 'express'
import {resultMatchSchema} from './resultMatchSchema.js'

export default function createResultMatchRoutes(resultMatchService) {
    const router = express.Router()

    router.post('/', async (req, res) => {
        try {
            const parsed = resultMatchSchema.parse(req.body)
            // Si no viene created_at / updated_at, se los seteamos ahora
            parsed.created_at ??= new Date()
            parsed.updated_at ??= new Date()

            const result = await resultMatchService.register.execute(parsed)
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

    router.get('/filtered', async (req, res) => {
        try {
            const {zone, category, tournament} = req.query

            const result = await resultMatchService.getResultsByZone.execute({
                zone: zone.toUpperCase(),
                category: Number(category),
                id_tournament: Number(tournament)
            })

            res.json({success: true, data:result})
        } catch (error) {
            res.status(500).json({success: false, error: error.message})
        }
    })


    return router
}

