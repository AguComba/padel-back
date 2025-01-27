import { executeQuery } from '../../utils/executeQuery.js'

export class ClubModel {
    static async getClubs() {
        try {
            const rows = await executeQuery('SELECT * FROM clubs where status = 1')
            return rows
        } catch (error) {
            throw new Error('Error getting clubs: ' + error.message)
        }
    }

    static async getClubById(id) {
        try {
            const rows = await executeQuery('SELECT * FROM clubs WHERE id = ?', [id])
            return rows.shift()
        } catch (error) {
            throw new Error('Error getting club by ID: ' + error.message)
        }
    }

    static async createClub(club) {
        try {
            const result = await executeQuery(
                'INSERT INTO clubs (name, id_city, id_federation, user_created, courts, id_administrator) VALUES (?, ?, ?, ?, ?, ?)',
                [club.name, club.id_city, club.id_federation, club.user_created, club.courts, club.id_administrator]
            )
            return result.insertId
        } catch (error) {
            throw new Error('Error creating club: ' + error.message)
        }
    }
}
