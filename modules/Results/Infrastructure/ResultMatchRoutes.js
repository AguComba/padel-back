import express from 'express'
import {resultMatchSchema} from './resultMatchSchema.js'
import {validateToken} from '../../../middlewares/validateToken.js'
import {hasRole} from '../../../middlewares/permisions.js'
import {TournamentModel} from '../../Tournaments/tournament.model.js'

export default function createResultMatchRoutes(resultMatchService) {
    const router = express.Router()

    router.post('/', validateToken, async (req, res) => {
        try {
            const {user} = req.session

            if(!hasRole(user, ['admin', 'superAdmin', 'largador'])){
                return res.status(403).json({success: false, error: 'No tienes permiso para realizar esta acción'})
            }

            //INYECTO EL USER CREATED Y USER UPDATED EN EL BODY
            req.body.user_created = user.id
            req.body.user_updated = user.id
            
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

    router.get('/largador', validateToken, async (req, res) => {
        try {
            const {tournament} = req.query
            const {user} = req.session

            if(!hasRole(user, ['admin', 'superAdmin', 'largador'])){
                return res.status(403).json({success: false, error: 'No tienes permiso para realizar esta acción'})
            }
            
            const isCreator = await TournamentModel.isMainClubUser(Number(tournament), Number(user.id))


            const result = await resultMatchService.getMatchsByUserLargador.execute({
                id_user: Number(user.id),
                id_tournament: Number(tournament),
                is_creator_or_admin: isCreator || hasRole(user, ['admin', 'superAdmin'])
            })

            res.json({success: true, data:result})
        } catch (error) {
            res.status(500).json({success: false, error: error.message})
        }
    })

    return router
}

