import { hasRole, isPlayer } from '../../middlewares/permisions.js'
import { InscriptionSchema } from '../../schemas/Inscription.schema.js'
import { PlayerModel } from '../Player/player.model.js'
import { TournamentModel } from '../Tournaments/tournament.model.js'
import { InscriptionModel } from './inscriptions.model.js'

// const existInscription = async () => {
//     try {

//     } catch (error) {
//         res.status(500).json({message: "Ocurrio un error al verificar la inscripcion"})
//     }
// }

const isValidPlayer = async (player, id_tournament) => {
    const aceptedTournament = await TournamentModel.searchTournamentByCategoryPlayer(player.id_cat, id_tournament)
    return !!aceptedTournament
}

const isInscriptedPlayer = async (player, id_tournament) => {
    const inscriptionStatus = await InscriptionModel.searchInscriptionByPlayerId(player.id, id_tournament)
    return inscriptionStatus || false
}

export const createInscriptionCouple = async (req, res) => {
    try {
        const inscription = req.body
        const { user = false } = req.session
        if (!isPlayer(user)) {
            return res.status(403).json({ message: 'El usuario debe ser un jugador para inscribirse' })
        }

        const player = await PlayerModel.searchByIdUserAfiliated(user.id)
        if (!player) {
            return res.status(401).json({ message: 'Usted no esta afilidado.' })
        }

        if (!(await isValidPlayer(player, inscription.id_tournament))) {
            return res.status(401).json({
                message: 'Usted no califica para jugar ningun torneo vigente'
            })
        }

        const statusInscriptionPlayer = await isInscriptedPlayer(player, inscription.id_tournament)
        if (statusInscriptionPlayer) {
            return res.status(400).json({
                message: `Usted ya es encuentra inscripto con ${
                    statusInscriptionPlayer.id_titular == player.id
                        ? statusInscriptionPlayer.companero
                        : statusInscriptionPlayer.titular
                }`
            })
        }

        inscription.id_player_1 = player.id
        inscription.id_club = player.id_club
        inscription.user_created = user.id

        const categoryTournamentPlayer1 = await TournamentModel.searchTournamentByCategoryPlayer(
            player.id_cat,
            inscription.id_tournament
        )

        inscription.id_category = categoryTournamentPlayer1.id_category
        const validInscription = InscriptionSchema.safeParse(inscription)
        if (!validInscription.success) {
            return res.status(400).json(validInscription.error.errors)
        }

        const player2 = await PlayerModel.searchById(validInscription.data.id_player_2)
        if (!player2.afiliation) {
            return res.status(400).json({ message: 'Tu compañero no esta afiliado.' })
        }

        if (!(await isValidPlayer(player2, validInscription.data.id_tournament))) {
            return res.status(401).json({
                message: 'Tu compañero no califica para jugar ningun torneo vigente'
            })
        }

        const statusInscriptionPlayer2 = await isInscriptedPlayer(player2, inscription.id_tournament)
        if (statusInscriptionPlayer2) {
            return res.status(400).json({
                message: `Su compañero ya es encuentra inscripto con ${
                    statusInscriptionPlayer2.id_titular == player2.id
                        ? statusInscriptionPlayer2.companero
                        : statusInscriptionPlayer2.titular
                }`
            })
        }
        const categoryTournamentPlayer2 = await TournamentModel.searchTournamentByCategoryPlayer(
            player2.id_cat,
            validInscription.data.id_tournament
        )

        if (categoryTournamentPlayer1.id_category !== categoryTournamentPlayer2.id_category) {
            return res.status(400).json({
                message: `Usted califica para jugar en ${categoryTournamentPlayer1.categoria} y su compañero en ${categoryTournamentPlayer2.categoria}. No pueden jugar juntos.`
            })
        }
        const inscriptionCrated = await InscriptionModel.create(validInscription.data)

        res.status(200).json(inscriptionCrated)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Ocurrio un error inesperado' })
    }
}
