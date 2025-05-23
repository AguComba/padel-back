import {isAcceptedUser, isAdmin, isPlayer} from '../../middlewares/permisions.js'
import {PlayerModel} from './player.model.js'
import {PlayerSchema} from '../../schemas/Player.schema.js'

export const getPlayers = async (req, res) => {
    try {
        const {user = false} = req.session
        if (!isAcceptedUser(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }

        const players = await PlayerModel.search()
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
export const getPlayersByIdUser = async (req, res) => {
    try {
        const {user = false} = req.session
        if (!isAcceptedUser(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }

        const players = await PlayerModel.searchByIdUser(user.id)
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getPlayersById = async (req, res) => {
    try {
        const {user = false} = req.session
        let {id} = req.params
        id = parseInt(id)
        if (!isAcceptedUser(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                message: 'Ocurrio un error. El id debe ser un numero'
            })
        }

        const players = await PlayerModel.searchById(id)
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getPlayersByCategory = async (req, res) => {
    try {
        const {user = false} = req.session
        const {id} = req.params
        if (!isAcceptedUser(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }

        const players = await PlayerModel.searchByCategory(id)
        res.status(200).json(players)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getPlayerByDni = async (req, res) => {
    try {
        const {user = false} = req.session
        const {dni = null} = req.params
        if (!isAcceptedUser(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }

        const player = await PlayerModel.searchByDni(dni)
        if (!player) {
            return res.status(400).json({message: 'No se encontro ningun jugador con ese dni'})
        }

        if (!player.afiliation) {
            return res.status(400).json({message: 'El jugador no esta afiliado'})
        }
        return res.status(200).json(player)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({message: 'Ocurrio un error interno'})
    }
}

const exisistPlayer = async (id_user) => {
    const player = await PlayerModel.searchByIdUserAfiliated(id_user)
    return !!player
}

export const createPlayer = async (req, res) => {
    try {
        const {user = false} = req.session
        const player = req.body
        if (!isPlayer(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }

        if (await exisistPlayer(user.id)) {
            return res.status(400).json({message: 'Ya eres jugador'})
        }
        player.id_user = user.id

        const validPlayer = PlayerSchema.safeParse(player)
        if (!validPlayer.success) {
            return res.status(400).json({message: validPlayer.error.errors})
        }

        const createdPlayer = await PlayerModel.create(validPlayer.data)
        res.status(201).json(createdPlayer)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const approveAffiliationPlayer = async (req, res) => {
    try {
        const {user = false} = req.session
        const {id} = req.params
        if (!isAdmin(user)) {
            return res.status(401).json({message: 'No tienes permisos para acceder a este recurso'})
        }

        const player = await PlayerModel.searchByIdUser(id)
        if (!player) {
            return res.status(400).json({message: 'No se encontro ningun jugador con ese id'})
        }

        if (player.afiliation) {
            return res.status(400).json({message: 'El jugador ya esta afiliado'})
        }

        player.afiliation = false
        const updatedPlayer = await PlayerModel.update(id, player)
        if (!updatedPlayer) {
            return res.status(400).json({message: 'No se pudo actualizar el jugador'})
        }
        return res.status(200).json({message: 'Jugador afiliado', player, updatedPlayer})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
