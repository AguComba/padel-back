import { isAdmin } from '../../middlewares/permisions.js'
import { FederationSchema } from '../../schemas/Federation.schema.js'
import { FederationsModel } from './federations.model.js'

export const getFederations = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAdmin(user)) {
      throw new Error('No tiene permisos para ver las federaciones')
    }
    const federations = await FederationsModel.getFederations()
    return res.status(200).json(federations)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getFederationById = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAdmin(user)) {
      throw new Error('No tiene permisos para ver una federacion')
    }
    const id = req.params.id
    const federation = await FederationsModel.getFederationById(id)
    return res.status(200).json(federation)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const createFederation = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAdmin(user)) {
      throw new Error('No tiene permisos para crear una federacion')
    }

    const federation = req.body
    const federationValidate = FederationSchema.safeParse(federation)

    if (!federationValidate.success) {
      throw new Error('ValidationError')
    }

    const newFederation = await FederationsModel.createFederation(federationValidate.data)

    return res.status(200).json(newFederation)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
