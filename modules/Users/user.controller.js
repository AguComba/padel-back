import { isAcceptedUser, isAdmin, isPlayer } from '../../middlewares/permisions.js'
import { UserPlayerUpdate } from '../../schemas/User.schema.js'
import { UserModel } from './user.model.js'

export const getAllUsers = async (req, res) => {
  try {
    const { user = null } = req.session
    const { dni } = req.query
    if (!isAcceptedUser(user)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' })
    }
    const users = await UserModel.searchAllUsers()
    if (dni) {
      const usersFiltered = users.filter((item) => {
        console.log(item)
        return item.number_document === dni
      })
      return res.status(200).json(usersFiltered)
    }
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ocurrio un error inesperado' })
  }
}

export const getUserByDni = async (req, res) => {
  try {
    const { dni = false } = req.query
    if (!dni) {
      return res.status(400).json({ message: 'No se envio ningun dni' })
    }

    const { user = null } = req.session
    if (!isAcceptedUser(user)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' })
    }
    const users = await UserModel.searchUserByDni(dni)
    return res.status(200).json(users)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Ocurrio un error inesperado' })
  }
}

export const updateUser = async (req, res) => {
  try {
    const userData = req.body
    userData.name = userData.name.toUpperCase()
    userData.last_name = userData.last_name.toUpperCase()
    const { user = null } = req.session
    if (!isPlayer(user)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' })
    }

    if (userData.id !== user.id && !isAdmin(user)) {
      return res.status(400).json({ message: 'No se envio ningun id' })
    }

    const validUser = UserPlayerUpdate.safeParse(userData)
    if (!validUser.success) {
      return res.status(400).json({ message: validUser.error.errors })
    }

    const userUpdated = await UserModel.updateUserAndPlayer(userData)
    return res.status(200).json(userUpdated)
  } catch (error) {}
}
