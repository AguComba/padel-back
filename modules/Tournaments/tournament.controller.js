import { hasRole, isAcceptedUser, isPlayer } from '../../middlewares/permisions.js'
import { TournamentSchema } from '../../schemas/Tournament.schema.js'
import { InscriptionModel } from '../Inscriptions/inscriptions.model.js'
import { PlayerModel } from '../Player/player.model.js'
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

    const tournamentCreated = await TournamentModel.create(validTournament)
    res.status(200).json(tournamentCreated)
  } catch (error) {
    console.log(error)
    return res.status(400).json(error.message)
  }
}

export const getTournaments = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAcceptedUser(user)) {
      return res.status(401).message('Usuario invalido')
    }

    const tournament = await TournamentModel.search()
    if (!tournament) {
      return res.status(404).json({ message: 'No se encontraron torneos vigentes' })
    }
    const tournamentsWithCategories = await Promise.all(
      tournament.map(async (item) => {
        const categories = await getCatigoriesByTournament(item.id)
        item.categories = categories
        return item
      }),
    )
    res.status(200).json({ tournament: tournamentsWithCategories })
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getCatigoriesByTournament = async (tournament_id) => {
  try {
    if (!tournament_id) {
      throw new Error('No se envio el id del torneo')
    }
    const categories = await TournamentModel.searchCategories(tournament_id)
    return categories
  } catch (error) {
    throw new Error(error.message)
  }
}

export const tournementAceptedByPlayer = async (req, res) => {
  try {
    const { id_tournament = false } = req.body
    const { user = null } = req.session
    if (!hasRole(user, ['player', 'admin', 'superAdmin'])) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' })
    }
    if (!id_tournament) {
      return res.status(400).json({ message: 'No se recibio el id del torneo.' })
    }

    if (!isPlayer(user)) {
      return res.status(403).json({ message: 'El usuario debe ser un jugador para poder inscribirse' })
    }

    const player = await PlayerModel.searchByIdUser(user.id)
    const aceptedTournament = await TournamentModel.searchTournamentByCategoryPlayer(player.id_cat, id_tournament, user.gender)
    if (!aceptedTournament) {
      return res.status(400).json({ message: 'El jugador no califica para ninguno de los torneos vigentes' })
    }
    const inscriptionsGenerated = await InscriptionModel.searchInscriptionByCategoryAndTournament(aceptedTournament.id, aceptedTournament.id_category)
    aceptedTournament.couples_inscripted = inscriptionsGenerated.couples_inscripted

    return res.status(200).json(aceptedTournament)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Ocurrio un error inesperado' })
  }
}
