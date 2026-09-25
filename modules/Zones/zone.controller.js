import { hasRole, isAdmin } from '../../middlewares/permisions.js'
import { CouplesModel } from '../Couples/couples.model.js'
import { updateDropsFromZones } from '../Drops/drop.controller.js'
import { ZonesModel } from './zone.model.js'
import {
    buscarPartidoEntreParejas,
    calcularEstadisticasOrdenadas,
    generarZonas,
    ordenarZonasGeneradas
} from './zone.logic.js'

export const generateByCategory = async(req, res) => {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }

        const { id_tournament, id_category, gender } = req.body
        const inscriptions = await CouplesModel.searchCouplesByTournamentAndCategory(id_tournament, id_category, gender)
        const generateds = await ZonesModel.searchGeneratedZones(id_tournament, id_category)
        const zones =
            generateds.length > 0
                ? await ordenarZonasGeneradas(generateds, inscriptions)
                : await generarZonas(inscriptions)
        return res.status(200).json({ count: inscriptions.length, zones, couples: inscriptions })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getZones = async(req, res) => {
    try {
        const { user = false } = req.session
        if (!user) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }
        const { tournament, category } = req.query
        const zones = await ZonesModel.getZones(tournament, category)
        return res.status(200).json(zones)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const saveZones = async(req, res) => {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }
        const data = req.body
        await ZonesModel.saveZones(data)
        return res.status(200).json({ message: 'Zonas guardadas correctamente' })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const endZone = async(req, res) => {
    try {
        const { user } = req.session
        if (!hasRole(user, ['admin', 'largador', 'superAdmin'])) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }

        const { id_matchs } = req.body
        if (!id_matchs) {
            return res.status(400).json({ message: 'Faltan parámetros obligatorios' })
        }

        const matchs = await ZonesModel.getMatchsByZone(id_matchs)
        if (matchs.length === 0) {
            return res.status(400).json({ message: 'No se encontraron partidos' })
        }

        // Mapear nombres por pareja
        const coupleNamesMap = {}
        for (const match of matchs) {
            if (!coupleNamesMap[match.id_couple1]) {
                coupleNamesMap[match.id_couple1] = match.pareja1
            }
            if (!coupleNamesMap[match.id_couple2]) {
                coupleNamesMap[match.id_couple2] = match.pareja2
            }
        }

        const estadisticas = calcularEstadisticasOrdenadas(matchs).map(stat => ({
            ...stat,
            nombre: coupleNamesMap[stat.id] || 'SIN NOMBRE'
        }))

        // Si la zona es de 4, verifico los partidos entre si para ver quien pasa segundo y tercero
        if (matchs.length === 4) {
            const secondCouple = estadisticas[1]
            const thirdCouple = estadisticas[2]
            // Verifico si el segundo perdio el partido contra el tercero
            const matchBetweenSecondAndThird = buscarPartidoEntreParejas(matchs, secondCouple.id, thirdCouple.id)

            if (matchBetweenSecondAndThird && matchBetweenSecondAndThird.winner_couple === thirdCouple.id) {
            // Si el segundo perdio, el tercero pasa a segundo
                estadisticas[1] = thirdCouple
                estadisticas[2] = secondCouple
            }
        }

        const updatedDrops = await updateDropsFromZones(estadisticas, id_matchs)

        return res.status(200).json({ estadisticas })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error interno del servidor' })
    }
}
