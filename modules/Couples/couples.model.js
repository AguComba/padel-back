import { executeQuery } from '../../utils/executeQuery.js'

export class CouplesModel {
    static async searchCouplesByTournamentAndCategory(id_tournament, category, gender) {
        const couples = await executeQuery(
            `SELECT 
            CONCAT(u1.name, " ", u1.last_name) AS jugador1, 
            CONCAT(u2.name, " ", u2.last_name) AS jugador2,
            COALESCE(r1.points, 0) + COALESCE(r2.points, 0) AS puntos_totales
        FROM inscriptions i
        INNER JOIN couples c ON i.id_couple = c.id
        INNER JOIN players p1 ON c.id_player1 = p1.id
        INNER JOIN players p2 ON c.id_player2 = p2.id
        INNER JOIN users u1 ON p1.id_user = u1.id
        INNER JOIN users u2 ON p2.id_user = u2.id
        LEFT JOIN ranking r1 
            ON r1.id_player = p1.id 
            AND r1.year = YEAR(CURDATE())
            AND r1.id_category = ? 
            AND r1.gender = ? 
        LEFT JOIN ranking r2 
            ON r2.id_player = p2.id 
            AND r2.year = YEAR(CURDATE())
            AND r2.id_category = ? 
            AND r2.gender = ? 
        WHERE i.id_tournament = ? AND i.status = 1 AND i.status_payment = 'PAID' and i.id_category = ?`,
            [category, gender, category, gender, id_tournament, category]
        )
        return couples
    }
}
