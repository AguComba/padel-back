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

export const importRanking = async (req, res) => {
    try {
        const {user = false} = req.session
        if (!isAdmin(user)) {
            return res.status(403).json('No esta autorizado para esto.')
        }

        const __dirname = path.resolve()
        const excel = await XlsxPopulate.fromFileAsync(`${__dirname}/archivos/.xlsx`)
        const values = excel.sheet('Jugadores').usedRange().value()
        const {id = false, puntos = false, estado = false} = getIndexColumns(values[0])
        const {gender = false, year = false, categoria = false, id_tournament = false} = req.body

        if (id === false || !puntos || !estado) {
            return res
                .status(400)
                .json(
                    "Ocurrio un error al leer el nombre de las columnas. Se espera 'id', 'categoria', 'puntos', 'estado'"
                )
        }
        if (!['F', 'X'].includes(gender)) {
            return res.status(400).json('Genero invalido')
        }
        if (!categoria) {
            return res.status(400).json('Debe enviar la categoria')
        }

        if (!year) {
            return res.status(400).json('Debe pasar el año')
        }

        if (!id_tournament) {
            return res.status(400).json('Debe pasar el torneo')
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
            user_updated: user.id,
            id_tournament: id_tournament
        }))

        const resultDB = await RankingModel.import(dataToInsert)

        console.log(resultDB)
        return res.status(200).json({message: 'Ranking importado con exito'})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
