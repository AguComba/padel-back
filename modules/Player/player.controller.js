import { isAcceptedUser, isPlayer } from '../../middlewares/permisions.js'
import { PlayerModel } from './player.model.js'
import { PlayerSchema } from '../../schemas/Player.schema.js'

export const getPlayers = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAcceptedUser(user)) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
        }

        const players = await PlayerModel.search()
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getPlayersById = async (req, res) => {
    try {
        const { user = false } = req.session
        const { id } = req.params
        if (!isAcceptedUser(user)) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
        }

        const players = await PlayerModel.searchById(id)
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getPlayersByCategory = async (req, res) => {
    try {
        const { user = false } = req.session
        const { id } = req.params
        if (!isAcceptedUser(user)) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
        }

        const players = await PlayerModel.searchByCategory(id)
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const exisistPlayer = async (id_user) => {
    const player = await PlayerModel.searchByIdUser(id_user)
    return !!player
}

export const createPlayer = async (req, res) => {
    try {
        const { user = false } = req.session
        const player = req.body
        if (!isPlayer(user)) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
        }

        if (await exisistPlayer(user.id)) {
            return res.status(400).json({ message: 'Ya eres jugador' })
        }
        player.id_user = user.id

        const validPlayer = PlayerSchema.safeParse(player)
        if (!validPlayer.success) {
            return res.status(400).json({ message: validPlayer.error.errors })
        }

        const createdPlayer = await PlayerModel.create(validPlayer.data)
        res.status(201).json(createdPlayer)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
