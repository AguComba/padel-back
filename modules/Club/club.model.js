import { connection } from '../../config/db.config.js'
export class ClubModel {
  static async getClubs() {
    const [rows] = await connection.query('SELECT * FROM clubs where status = 1')
    return rows
  }

  static async getClubById(id) {
    const [rows] = await connection.query('SELECT * FROM clubs WHERE id = ?', [id])
    return rows.shift()
  }

  static async createClub(club) {
    const [result] = await connection.query('INSERT INTO clubs (name, id_city, id_federation, user_created, courts, id_administrator) VALUES (?, ?, ?, ?, ?, ?)', [
      club.name,
      club.id_city,
      club.id_federation,
      club.user_created,
      club.courts,
      club.id_administrator,
    ])
    return result.insertId
  }
}
