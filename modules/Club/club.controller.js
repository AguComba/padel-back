import { hasRole, isAcceptedUser } from '../../middlewares/permisions.js'
import { ClubSchema } from '../../schemas/Club.schema.js'
import { ClubModel } from './club.model.js'

export const getAllClubs = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAcceptedUser(user)) {
      throw new Error('No tienes permisos para acceder a esta ruta')
    }

    const clubes = await ClubModel.getClubs()

    res.status(200).json(clubes)
    // Logica para obtener todos los clubes
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getClubById = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAcceptedUser(user)) {
      throw new Error('No tienes permisos para acceder a esta ruta')
    }

    const { id } = req.params
    const club = await ClubModel.getClubById(id)

    res.status(200).json(club)
    // Logica para obtener un club por su id
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createClub = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!hasRole(user, ['admin', 'superAdmin'])) {
      throw new Error('No tienes permisos para acceder a esta ruta')
    }

    const club = req.body
    club.user_created = user.id

    const clubValidate = ClubSchema.safeParse(club)
    if (!clubValidate.success) {
      throw new Error(clubValidate.error.errors[0].message)
    }

    const id = await ClubModel.createClub(club)
    res.status(201).json({ id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
