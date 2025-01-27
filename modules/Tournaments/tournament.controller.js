import { ZodError } from 'zod'
import { hasRole } from '../../middlewares/permisions.js'
import { TournamentSchema } from '../../schemas/Tournament.schema.js'
import { TournamentModel } from './tournament.model.js'

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/')
  return new Date(`${year}-${month}-${day}`)
}

export const createTournament = async (req, res) => {
  try {
    const { user = false } = req.session
    const tournament = req.body
    if (!hasRole(user, ['admin', 'superAdmin'])) {
      return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
    }

    tournament.date_start = parseDate(tournament.date_start)
    tournament.date_inscription_start = parseDate(tournament.date_inscription_start)
    tournament.date_inscription_end = parseDate(tournament.date_inscription_end)

    const validTournament = TournamentSchema.parse(tournament)
    validTournament.user_created = user.id
    console.log(validTournament)

    const tournamentCreated = await TournamentModel.create(validTournament)
    res.status(200).json(tournamentCreated)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}
