import { hasRole } from '../../middlewares/permisions.js'
import { PlayerModel } from '../Player/player.model.js'
import { TournamentModel } from '../Tournaments/tournament.model.js'

// const existInscription = async () => {
//     try {

//     } catch (error) {
//         res.status(500).json({message: "Ocurrio un error al verificar la inscripcion"})
//     }
// }

export const validUserInscription = async (req, res) => {
    try {
        const { id_tournament = false } = req.body
        const { user = null } = req.session
        if (!hasRole(user, ['player', 'admin', 'superAdmin'])) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' })
        }
        if (!id_tournament) {
            return res.status(400).json({ message: 'No se recibio el id del torneo.' })
        }

        //Validar que el usuario no este inscripto antes

        if (user.typeUser !== 1) {
            return res.status(403).json({ message: 'El usuario debe ser un jugador para poder inscribirse' })
        }
        const player = await PlayerModel.searchByIdUser(user.id)
        const aceptedTournament = await TournamentModel.searchTournamentByCategoryPlayer(player.id_cat, id_tournament)
        return res.status(200).json(aceptedTournament)
    } catch (error) {
        console.log(error)
    }
}
