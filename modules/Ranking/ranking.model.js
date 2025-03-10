import { executeQuery } from '../../utils/executeQuery.js'
import { handleTransaction } from '../../utils/transactions.js'

export class RankingModel {
    static async search(cat, gen, year) {
        try {
            const currentYear = new Date().getFullYear()
            const queryParams = []
            let query = `
            SELECT r.points, u.name, u.last_name, cat.name as category, c.name as club, r.status
            FROM ranking r
            INNER JOIN players p ON r.id_player = p.id
            INNER JOIN clubs c ON p.id_club = c.id
            INNER JOIN users u ON p.id_user = u.id
            INNER JOIN categories cat ON r.id_category = cat.id
            WHERE true=true` // 1=1 permite agregar condiciones sin preocuparse por la sintaxis

            // Agregar año
            query += ' AND r.year = ?'
            queryParams.push(year || currentYear)

            // Agregar filtro por categoría si está presente
            if (cat) {
                query += ' AND r.id_category = ?'
                queryParams.push(cat)
            }

            // Agregar filtro por género si está presente
            if (gen) {
                query += ' AND r.gender = ?'
                queryParams.push(gen)
            }

            // Ordenar por puntos en orden descendente
            query += ' ORDER BY r.points DESC'

            const rows = await executeQuery(query, queryParams)
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
                        console.log(rank.id_player)
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
