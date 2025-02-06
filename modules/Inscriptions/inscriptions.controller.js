import { hasRole, isPlayer } from '../../middlewares/permisions.js'
import { InscriptionSchema } from '../../schemas/Inscription.schema.js'
import { PlayerModel } from '../Player/player.model.js'
import { TournamentModel } from '../Tournaments/tournament.model.js'

// const existInscription = async () => {
//     try {

//     } catch (error) {
//         res.status(500).json({message: "Ocurrio un error al verificar la inscripcion"})
//     }
// }

const isValidPlayer = async (id_user, id_tournament) => {
    const player = await PlayerModel.searchByIdUser(id_user)
    const aceptedTournament = await TournamentModel.searchTournamentByCategoryPlayer(player.id_cat, id_tournament)
    return !!aceptedTournament
}

export const createInscriptionCouple = async (req, res) => {
    try {
        const inscription = req.body
        const { user = false } = req.session
        if (!isPlayer(user)) {
            return res.status(403).json({ message: 'El usuario debe ser un jugador para inscribirse' })
        }
        const player = await PlayerModel.searchByIdUser(user.id)
        if (!(await isValidPlayer(user.id, inscription.id_tournament))) {
            return res.status(401).json({
                message: 'El usuario que esta realizando la inscripcion no califica para jugar ningun torneo vigente'
            })
        }
        inscription.id_player_1 = player.id

        const validInscription = InscriptionSchema.safeParse(inscription)
        if (!validInscription.success) {
            return res.status(400).json(validInscription.error.errors)
        }

        return res.status(200).json(validInscription.data)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Ocurrio un error inesperado' })
    }
}
