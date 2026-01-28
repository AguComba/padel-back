import { templateDrops } from './templatesDrops.js'
import { InscriptionModel } from '../Inscriptions/inscriptions.model.js'

export const getDrops = async (req, res) => {
    try {
        const {user = false} = req.session
        if(!user) throw new Error('No tienes permisos para acceder a esta ruta')
        
        const {tournament, cat} = req.query
        if(!tournament || !cat) throw new Error('Faltan parametros')
        
        const {couples_inscripted} = await InscriptionModel.searchInscriptionByCategoryAndTournament(tournament, cat)
        const drop = couples_inscripted > 48 ? templateDrops.find((item) => item.couples === 48) : templateDrops.find((item) => item.couples === couples_inscripted)

        res.status(200).json(drop)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}