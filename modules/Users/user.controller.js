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
        if (userData.name) userData.name = userData.name.toUpperCase()
        if (userData.last_name) userData.last_name = userData.last_name.toUpperCase()
        const { user = null } = req.session
        if (!isPlayer(user) && !isAdmin(user)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' })
        }

        if (userData.id !== user.id && !isAdmin(user)) {
            return res
                .status(400)
                .json({ message: 'El id del usuario logeado es distinto al que se quiere actualizar' })
        }

        const validUser = UserPlayerUpdate.safeParse(userData)
        if (!validUser.success) {
            return res.status(400).json({ message: validUser.error.errors })
        }

        const { skipRankingUpdate, id_category } = userData

        // Obtener la categoría anterior ANTES de actualizar
        let oldCategoryId = null
        if (!skipRankingUpdate && id_category && isAdmin(user)) {
            const playerBefore = await UserModel.getPlayerCategory(userData.id)
            oldCategoryId = playerBefore?.id_category
        }

        const userUpdated = await UserModel.updateUserAndPlayer(userData)

        // Por defecto actualiza automáticamente el status del jugador si cambió de categoría
        // y estaba en el ranking de la categoría anterior. Solo salta si skipRankingUpdate es true
        if (!skipRankingUpdate && id_category && oldCategoryId && isAdmin(user)) {
            try {
                await UserModel.updatePlayerStatusByCategory(
                    userData.id,
                    id_category,
                    oldCategoryId,
                    user.gender
                )
            } catch (error) {
                console.error('Error actualizando status del jugador:', error)
                // No fallar la actualización del usuario si falla la del ranking
            }
        }

        return res.status(200).json(userUpdated)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Ocurrio un error inesperado' })
    }
}
