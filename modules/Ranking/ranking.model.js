import {executeQuery} from '../../utils/executeQuery.js'
import {handleTransaction} from '../../utils/transactions.js'

export class RankingModel {
    static async search(cat, gen, year) {
        try {
            const currentYear = new Date().getFullYear()
            const queryParams = []
            let query = `
            SELECT r.id_player, r.points, u.name, u.last_name, cat.name as category, c.name as club, r.status, r.gender, r.id_category
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

    static async searchByPlayer(id, cat, gen, year) {
        try {
            const currentYear = new Date().getFullYear()
            const yearParam = year || currentYear
            const params = [cat, id, id, gen, yearParam, cat]
            let query = `SELECT 
                t.id AS tournament_id,
                t.name AS tournament_name,
                t.date_start,
                COALESCE(MAX(CASE 
                    WHEN c.id IS NOT NULL THEN c.points
                    ELSE 0 
                END), 0) AS player_points,
                MAX(CASE 
                    WHEN c.id IS NOT NULL THEN true 
                    ELSE false 
                END) AS participated
                FROM tournaments t
                LEFT JOIN inscriptions i 
                ON i.id_tournament = t.id 
                AND i.status = 1
                AND i.status_payment = 'paid'
                AND i.id_category = ?
                LEFT JOIN couples c 
                ON c.id = i.id_couple 
                AND (c.id_player1 = ? OR c.id_player2 = ?)
                WHERE t.gender = ? 
                AND t.ranked = 1
                AND YEAR(t.date_start) = ?
                AND EXISTS (
                    SELECT 1 
                    FROM inscriptions ix 
                    WHERE ix.id_tournament = t.id 
                    AND ix.id_category = ?
                )
                GROUP BY t.id, t.name, t.date_start;`
            const rows = await executeQuery(query, params)
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
                        `SELECT id, points FROM ranking 
                         WHERE id_player = ? AND id_category = ? AND gender = ? AND year = ? 
                         LIMIT 1`,
                        [rank.id_player, rank.id_category, rank.gender, rank.year]
                    )

                    if (existing.length > 0) {
                        const points = existing[0].points + rank.points
                        console.log(points, rank.id_player)
                        // Si el registro ya existe, lo actualizamos
                        await connection.query(`UPDATE ranking SET points = ?, user_updated = ? WHERE id = ?`, [
                            points,
                            rank.user_updated,
                            existing[0].id
                        ])
                        updated++
                    } else {
                        // Si no existe, insertamos un nuevo registro
                        console.log(rank.points, rank.id_player)
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
                    // 🔄 ACTUALIZAR PUNTOS EN LA PAREJA
                    const [parejas] = await connection.query(
                        `SELECT c.id FROM inscriptions i
                     JOIN couples c ON c.id = i.id_couple
                     WHERE i.id_category = ? AND i.id_tournament = ? 
                     AND (c.id_player1 = ? OR c.id_player2 = ?) 
                     LIMIT 1`,
                        [rank.id_category, rank.id_tournament, rank.id_player, rank.id_player]
                    )

                    if (parejas.length > 0) {
                        const parejaId = parejas[0].id

                        // Solo actualizamos con los puntos actuales del jugador en este torneo
                        await connection.query(`UPDATE couples SET points = ? WHERE id = ?`, [rank.points, parejaId])
                    }
                    console.log(updated, added)
                }
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
