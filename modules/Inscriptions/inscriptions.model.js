import { executeQuery } from '../../utils/executeQuery.js'
import { handleTransaction } from '../../utils/transactions.js'

export class InscriptionModel {
    static async searchInscriptionByUserID(id) {
        executeQuery('SELECT * FROM inscriptions')
    }

    static async searchInscriptionByCategoryAndTournament(id_tournament, id_category) {
        console.log(id_tournament, id_category)
        const result = await executeQuery(
            `
        SELECT COUNT(*) AS couples_inscripted FROM inscriptions
        WHERE id_tournament = ? AND id_category = ? AND status = 1 AND status_payment = 'PAID'
        `,
            [id_tournament, id_category]
        )

        console.log(result)
        return result.shift()
    }

    static async create(inscription) {
        return await handleTransaction(async (connection) => {
            const {
                id_player_1,
                id_player_2,
                id_club,
                id_tournament,
                availablity_days,
                user_created,
                status,
                id_category
            } = inscription
            const [rowsCouple] = await connection.query(
                `
                INSERT INTO couples (id_player1, id_player2, id_club, points, status) 
                VALUES (?,?,?,?,?)`,
                [id_player_1, id_player_2, id_club, 0, 1]
            )
            if (rowsCouple.affectedRows === 0) {
                throw new Error('No se pudo crear la pareja')
            }

            const idCouple = rowsCouple.insertId

            const [rowsInscription] = await connection.query(
                `
                INSERT INTO inscriptions (id_tournament, id_couple, id_category, status, status_payment, user_created, user_updated)
                VALUES(?, ?, ?, ?, ?, ?, ?)
                `,
                [id_tournament, idCouple, id_category, status, 'PENDING', user_created, user_created]
            )

            if (rowsInscription.affectedRows === 0) {
                throw new Error('No se pudo crear la inscripcion')
            }

            const inscriptionId = rowsInscription.insertId
            const coupleGameData = availablity_days.map((day) => [inscriptionId, day])

            const [rowsCoupleGameDays] = await connection.query(
                `INSERT INTO couple_game_days (id_inscription, availablity_days)
                VALUES ?
                `,
                [coupleGameData]
            )

            if (rowsCoupleGameDays.affectedRows === 0) {
                throw new Error('No se pudo crar los dias de la parjea')
            }
            return { id_inscription: inscriptionId, id_couple: idCouple }
        })
    }
}
