import { templateDrops } from './templatesDrops.js'
import { InscriptionModel } from '../Inscriptions/inscriptions.model.js'
import {ZonesModel} from '../Zones/zone.model.js'
import {DropModel} from './drop.model.js'

export const getDrops = async (req, res) => {
    try {
        const {user = false} = req.session
        if(!user) throw new Error('No tienes permisos para acceder a esta ruta')
        
        const {tournament, cat, replace = false} = req.query
        if(!tournament || !cat) throw new Error('Faltan parametros')
        
        const {couples_inscripted} = await InscriptionModel.searchInscriptionByCategoryAndTournament(tournament, cat)
        let drop = couples_inscripted > 48 ? templateDrops.find((item) => item.couples === 48) : templateDrops.find((item) => item.couples === couples_inscripted)

        if(replace) {
            const matches = await ZonesModel.getZones(tournament, cat, true);
            drop = drop.matches.map((match) => {
                const [instance, matchNumber] = match.id.split('-')
                const currentMatch = matches.find((item) => item.match == matchNumber && item.zone === instance)
                if(!currentMatch) {
                    return match
                }

                return {
                    id: match.id, 
                    rival1: currentMatch.pareja1 === 'SIN PAREJA' ? currentMatch.rival1 : currentMatch.pareja1, 
                    rival2: currentMatch.pareja2 === 'SIN PAREJA' ? currentMatch.rival2 : currentMatch.pareja2, 
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
        if(!user) throw new Error('No tienes permisos para acceder a esta ruta')
        
        const {tournament, category, matches} = req.body
        if(!tournament || !category || !matches) throw new Error('Faltan parametros')
        
        const newDrops = await DropModel.createDrops(tournament, category, matches)

        if(!newDrops) throw new Error('Error al crear los drops')

        res.status(200).json({message: `Se crearon los drops para el torneo ${tournament} y la categoria ${category}`})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}