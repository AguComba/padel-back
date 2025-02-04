import { isAcceptedUser } from '../../middlewares/permisions.js'
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
        console.log(dni)
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
