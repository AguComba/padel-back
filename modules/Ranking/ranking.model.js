import { executeQuery } from '../../utils/executeQuery.js'

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
}
