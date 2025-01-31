import { hasRole } from '../../middlewares/permisions.js'
import { TournamentSchema } from '../../schemas/Tournament.schema.js'
import { TournamentModel } from './tournament.model.js'
import { parse } from '@formkit/tempo'

const parseDateTempo = (dateString, time = false) => {
    let data = null
    if (time) {
        data = parse(dateString, 'DD/MM/YYYY HH:mm:ss', 'es')
        return data
    }
    data = parse(dateString, 'DD/MM/YYYY', 'es')
    return data
}

export const createTournament = async (req, res) => {
    try {
        const { user = false } = req.session
        const tournament = req.body
        if (!hasRole(user, ['admin', 'superAdmin'])) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
        }

        tournament.date_start = parseDateTempo(tournament.date_start)
        tournament.date_end = parseDateTempo(tournament.date_end)
        tournament.date_inscription_start = parseDateTempo(tournament.date_inscription_start, true)
        tournament.date_inscription_end = parseDateTempo(tournament.date_inscription_end, true)

        const validTournament = TournamentSchema.parse(tournament)
        validTournament.user_created = user.id
        console.log(validTournament)

        const tournamentCreated = await TournamentModel.create(validTournament)
        res.status(200).json(tournamentCreated)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}
