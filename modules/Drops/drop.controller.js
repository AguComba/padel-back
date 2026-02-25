import {templateDrops} from './templatesDrops.js'
import {InscriptionModel} from '../Inscriptions/inscriptions.model.js'
import {ZonesModel} from '../Zones/zone.model.js'
import {DropModel} from './drop.model.js'
import {resultMatchSchema} from '../Results/Infrastructure/resultMatchSchema.js'
import {hasRole} from '../../middlewares/permisions.js'
import ResultMatchRepositoryMysql from '../Results/Infrastructure/ResultMatchRepositoryMysql.js'
import {createResultMatchService} from '../Results/Application/services/resultMatchService.js'

const resultMatchRepository = new ResultMatchRepositoryMysql()
const resultMatchService = createResultMatchService(resultMatchRepository)

export const getDrops = async (req, res) => {
    try {
        const {user = false} = req.session
        if (!user) throw new Error('No tienes permisos para acceder a esta ruta')

        const {tournament, cat, replace = false} = req.query
        if (!tournament || !cat) throw new Error('Faltan parametros')

        const {couples_inscripted} = await InscriptionModel.searchInscriptionByCategoryAndTournament(tournament, cat)
        let drop = couples_inscripted > 48 ? templateDrops.find((item) => item.couples === 48) : templateDrops.find((item) => item.couples === couples_inscripted)

        if (replace) {
            const matches = await ZonesModel.getZones(tournament, cat, true);
            drop = drop.matches.map((match) => {
                const [instance, matchNumber] = match.id.split('-')
                const currentMatch = matches.find((item) => item.match == matchNumber && item.zone === instance)
                if (!currentMatch) {
                    return match
                }

                return {
                    id: match.id,
                    rival1: currentMatch.pareja1 === 'SIN PAREJA' ? currentMatch.rival1 : currentMatch.pareja1_last_name,
                    rival2: currentMatch.pareja2 === 'SIN PAREJA' ? currentMatch.rival2 : currentMatch.pareja2_last_name,
                    club: currentMatch.club_name,
                    hour: currentMatch.hour,
                    day: currentMatch.day,
                    setCouple1: [currentMatch.first_set_couple1, currentMatch.second_set_couple1, currentMatch.third_set_couple1],
                    setCouple2: [currentMatch.first_set_couple2, currentMatch.second_set_couple2, currentMatch.third_set_couple2],
                    winner: currentMatch.winner_couple,
                    wo: currentMatch.wo
                }
            })
        }

        res.status(200).json(drop)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const createDrops = async (req, res) => {
    try {
        const {user = false} = req.session
        if (!user) throw new Error('No tienes permisos para acceder a esta ruta')

        const {tournament, category, matches} = req.body
        if (!tournament || !category || !matches) throw new Error('Faltan parametros')

        const newDrops = await DropModel.createDrops(tournament, category, matches)

        if (!newDrops) throw new Error('Error al crear los drops')

        res.status(200).json({message: `Se crearon los drops para el torneo ${tournament} y la categoria ${category}`})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const updateDropsFromZones = async (stats, id_matchs) => {
    try {
        const {drops, zone, allDrops} = await DropModel.findUpdateDrops(id_matchs)
        const updatedDropsById = new Map()

        const markDropUpdated = (drop) => {
            updatedDropsById.set(drop.id, drop)
        }

        const propagateQualifiedCouple = (sourceMatchId, idCouple, visitedMatches = new Set()) => {
            const nextDrop = allDrops.find((drop) => drop.rival1 === sourceMatchId || drop.rival2 === sourceMatchId)
            if (!nextDrop) return

            const nextDropId = `${nextDrop.zone}-${nextDrop.match}`
            if (visitedMatches.has(nextDropId)) return
            visitedMatches.add(nextDropId)

            if (nextDrop.rival1 === sourceMatchId) {
                nextDrop.id_couple1 = idCouple
                markDropUpdated(nextDrop)
                if (nextDrop.rival2 == null) {
                    propagateQualifiedCouple(nextDropId, idCouple, visitedMatches)
                }
                return
            }

            nextDrop.id_couple2 = idCouple
            markDropUpdated(nextDrop)
            if (nextDrop.rival1 == null) {
                propagateQualifiedCouple(nextDropId, idCouple, visitedMatches)
            }
        }

        // Agrego el id_couple a cada drop segun corresponda
        drops.forEach((drop) => {
            // Verifico a donde tengo que agregar el id_couple, saco la ultima letra del string para determinar cual stats usar
            if (drop.rival1.includes(zone)) {
                // Hago el slice para obtener el numero de la pareja a reemplazar y restarle 1 para obtener el indice correcto en stats
                drop.id_couple1 = stats[drop.rival1.slice(-1) - 1].id
                markDropUpdated(drop)

                if (drop.rival2 == null) {
                    propagateQualifiedCouple(`${drop.zone}-${drop.match}`, drop.id_couple1)
                }
            } else if (drop.rival2.includes(zone)) {
                // Hago el slice para obtener el numero de la pareja a reemplazar y restarle 1 para obtener el indice correcto en stats
                drop.id_couple2 = stats[drop.rival2.slice(-1) - 1].id
                markDropUpdated(drop)

                if (drop.rival1 == null) {
                    propagateQualifiedCouple(`${drop.zone}-${drop.match}`, drop.id_couple2)
                }
            }
        })

        const updatedDrops = await DropModel.updateDrops(Array.from(updatedDropsById.values()))

        if (!updatedDrops) throw new Error('Error al actualizar los drops')

        return drops
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addResultDrop = async (req, res) => {
    try {
        const {user} = req.session


        if (!hasRole(user, ['admin', 'superAdmin', 'largador'])) {
            return res.status(403).json({success: false, error: 'No tienes permiso para realizar esta acción'})
        }

        const {id_match} = req.body

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
        res.status(400).json({message: error.message})
    }
}