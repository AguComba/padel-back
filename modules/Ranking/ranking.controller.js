import XlsxPopulate from 'xlsx-populate'
import {isAcceptedUser, isAdmin, isPlayer} from '../../middlewares/permisions.js'
import {RankingModel} from './ranking.model.js'
import path from 'path'

export const getRanking = async (req, res) => {
    try {
        // Extraer los parámetros de la query
        const {cat, gen, year} = req.query

        // Llamar al modelo pasando los parámetros
        const ranking = await RankingModel.search(cat || null, gen || null, year ? parseInt(year, 10) : null)

        res.status(200).json(ranking)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

export const getRankingByPlayer = async (req, res) => {
    try {
        const {id, cat, gen, year} = req.query

        const ranking = await RankingModel.searchByPlayer(id, cat || null, gen || null, year ? parseInt(year, 10) : null)
        return res.status(200).json(ranking)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getIndexColumns = (columns) => {
    try {
        const claves = ['id', 'categoria', 'puntos', 'estado']
        return claves.reduce((indices, clave) => {
            indices[clave] = columns.findIndex((col) => col.toLowerCase() === clave.toLowerCase())
            return indices
        }, {})
    } catch (error) {
        throw new Error(
            "Ocurrio un error al leer el nombre de las columnas. Se espera 'id', 'categoria', 'puntos', 'estado'"
        )
    }
}

export const importRankingFromResults = async (req, res) => {
    try {
        const {user = false} = req.session
        if (!isAdmin(user)) {
            return res.status(403).json('No esta autorizado para esto.')
        }

        const {year = Date.now().getFullYear(), categoria = false, id_tournament = false} = req.body

        if (!categoria) {
            return res.status(400).json('Debe enviar la categoria')
        }

        if (!id_tournament) {
            return res.status(400).json('Debe pasar el torneo')
        }

        const result = await RankingModel.importFromResults({
            id_tournament,
            id_category: categoria,
            year,
            user_updated: user.id
        })

        return res.status(200).json({
            message: 'Ranking actualizado con resultados de zonas/cuadro',
            ...result
        })
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}