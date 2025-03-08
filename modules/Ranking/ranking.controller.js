import XlsxPopulate from 'xlsx-populate'
import { isAcceptedUser, isAdmin, isPlayer } from '../../middlewares/permisions.js'
import { RankingModel } from './ranking.model.js'
import path from 'path'

export const getRanking = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAcceptedUser(user)) {
            return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
        }

        const ranking = await RankingModel.search()
        res.status(200).json(ranking)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getIndexColumns = (columns) => {
    const claves = ['id', 'categoria', 'puntos', 'estado']
    return claves.reduce((indices, clave) => {
        indices[clave] = columns.findIndex((col) => col.toLowerCase() === clave.toLowerCase())
        return indices
    }, {})
}

export const importRanking = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            return res.status(403).json('No esta autorizado para esto.')
        }

        const __dirname = path.resolve()
        const excel = await XlsxPopulate.fromFileAsync(`${__dirname}/archivos/IMPAR-CABALLEROS-5TA.xlsx`)
        const values = excel.sheet('Jugadores').usedRange().value()
        const { id, puntos, estado } = getIndexColumns(values[0])
        const { gender = false, year = false, categoria = false } = req.body

        if (!['F', 'X'].includes(gender)) {
            return res.status(400).json('Genero invalido')
        }
        if (!categoria) {
            return res.status(400).json('Debe enviar la categoria')
        }

        if (!year) {
            return res.status(400).json('Debe pasar el año')
        }
        // Comienzo a recorrer values despues de la primer fila
        // id player, puntos, federacion, categoria, estado, año, genero
        const dataToInsert = values.slice(1).map((row) => ({
            id_player: row[id],
            points: row[puntos],
            id_federation: 1,
            id_category: categoria,
            status: row[estado] === 'ASCENDIDO' ? 2 : 1,
            year: year,
            gender: gender,
            user_updated: user.id
        }))

        const resultDB = await RankingModel.import(dataToInsert)

        return res.status(200).json(resultDB)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const createRanking = async (req, res) => {
    try {
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
