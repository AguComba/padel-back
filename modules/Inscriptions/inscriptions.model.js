import { executeQuery } from '../../utils/executeQuery.js'
import { handleTransaction } from '../../utils/transactions.js'

export class InscriptionModel {
    static async search(id_tournament) {
        const inscriptions = executeQuery(
            `SELECT 
            i.id,
            cat.id AS id_category,
            cat.name AS categoria,
            CONCAT(u1.name, " ", u1.last_name) AS jugador1, 
            p1.id AS id_player1,
            CONCAT(u2.name, " ", u2.last_name) AS jugador2,
            p2.id AS id_player2,
            i.status, 
            i.status_payment,
            GROUP_CONCAT(d.availablity_days ORDER BY d.availablity_days SEPARATOR ', ') AS dias_seleccionados,
            observation
            FROM inscriptions i
            INNER JOIN couples c ON i.id_couple = c.id
            INNER JOIN players p1 ON c.id_player1 = p1.id
            INNER JOIN players p2 ON c.id_player2 = p2.id
            INNER JOIN users u1 ON p1.id_user = u1.id
            INNER JOIN users u2 ON p2.id_user = u2.id           
            INNER JOIN categories cat ON i.id_category = cat.id
            LEFT JOIN couple_game_days d ON d.id_inscription = i.id
            WHERE i.id_tournament = ? 
            GROUP BY i.id, cat.id, cat.name, jugador1, jugador2, i.status, i.status_payment;`,
            [id_tournament]
        )
        return inscriptions
    }

    static async searchInscriptionByPlayerId(id_player, id_tournament) {
        const player = await executeQuery(
            `
            SELECT concat(u1.name, " ", u1.last_name) as titular, p1.id as id_titular,
            concat(u2.name, " ", u2.last_name) as companero, p2.id as id_companero FROM inscriptions i
            INNER JOIN couples c ON c.id = i.id_couple
            INNER JOIN players p1 ON c.id_player1 = p1.id
            INNER JOIN players p2 ON c.id_player2 = p2.id
            INNER JOIN users u1 ON p1.id_user = u1.id
            INNER JOIN users u2 ON p2.id_user = u2.id
            WHERE i.status = 1 AND i.status_payment = "PAID" AND (c.id_player1 = ? OR c.id_player2 = ?) AND i.id_tournament = ?
            `,
            [id_player, id_player, id_tournament]
        )
        return player.shift()
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
                id_category,
                observation
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
                INSERT INTO inscriptions (id_tournament, id_couple, id_category, status, 
                status_payment, user_created, user_updated, observation)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [id_tournament, idCouple, id_category, status, 'PENDING', user_created, user_created, observation]
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
