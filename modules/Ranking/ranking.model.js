import { executeQuery } from '../../utils/executeQuery.js'
import { handleTransaction } from '../../utils/transactions.js'

export class RankingModel {
    static async search() {
        try {
            const currentYear = new Date().getFullYear()
            const [rows] = await executeQuery(
                `SELECT r.points, u.name, u.last_name, cat.name as category FROM ranking r
          INNER JOIN players p ON r.id_player = p.id
          INNER JOIN users u ON p.id_user = u.id
          inner join categories cat on p.id_category = cat.id
        WHERE r.year = ?
        ORDER BY r.points DESC`,
                [currentYear]
            )
            return rows
        } catch (error) {
            throw new Error(error)
        }
    }

    static async import(data) {
        try {
            return await handleTransaction(async (connection) => {
                let updated = 0
                let added = 0
                for (const rank of data) {
                    // Buscar si ya existe un registro con los criterios especificados
                    const [existing] = await connection.query(
                        `SELECT id FROM ranking 
                         WHERE id_player = ? AND id_category = ? AND gender = ? AND year = ? 
                         LIMIT 1`,
                        [rank.id_player, rank.id_category, rank.gender, rank.year]
                    )

                    if (existing.length > 0) {
                        // Si el registro ya existe, lo actualizamos
                        await connection.query(`UPDATE ranking SET points = ?, user_updated = ? WHERE id = ?`, [
                            rank.points,
                            rank.user_updated,
                            existing[0].id
                        ])
                        updated++
                    } else {
                        // Si no existe, insertamos un nuevo registro
                        await connection.query(
                            `INSERT INTO ranking (id_player, points, id_federation, id_category, status, year, gender, user_updated) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                rank.id_player,
                                rank.points,
                                rank.id_federation,
                                rank.id_category,
                                rank.status,
                                rank.year,
                                rank.gender,
                                rank.user_updated
                            ]
                        )
                        added++
                    }
                    console.log(updated, added)
                }
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
