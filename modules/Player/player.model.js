import { executeQuery } from '../../utils/executeQuery.js'
export class PlayerModel {
  static async search() {
    try {
      const rows = await executeQuery(
        `SELECT p.id, p.possition, p.hand, cat.name as category, c.name as club, u.name, u.last_name FROM players p
         inner join categories cat on p.id_category = cat.id 
         inner join users u on p.id_user = u.id 
         inner join clubs c on p.id_club = c.id`,
      )
      return rows
    } catch (error) {
      throw new Error(error)
    }
  }

  static async searchById(id) {
    try {
      const rows = await executeQuery(
        `SELECT p.id, p.possition, p.hand, cat.name as category, c.name as club, u.name, u.last_name FROM players p
         inner join categories cat on p.id_category = cat.id 
         inner join users u on p.id_user = u.id 
         inner join clubs c on p.id_club = c.id
         where p.id = ?`,
        [id],
      )
      return rows.shift()
    } catch (error) {
      throw new Error(error)
    }
  }

  static async searchByCategory(id) {
    try {
      const rows = await executeQuery(
        `SELECT p.id, p.possition, p.hand, cat.name as category, c.name as club, u.name, u.last_name FROM players p
         inner join categories cat on p.id_category = cat.id 
         inner join users u on p.id_user = u.id 
         inner join clubs c on p.id_club = c.id
         where cat.id = ?`,
        [id],
      )
      return rows
    } catch (error) {
      throw new Error(error)
    }
  }

  static async create(player) {
    try {
      const rows = await executeQuery(`INSERT INTO players (id_user, id_category, possition, hand, afiliation, id_club) VALUES (?, ?, ?, ?, ?, ?)`, [
        player.id_user,
        player.id_category,
        player.possition,
        player.hand,
        player.afiliation,
        player.id_club,
      ])
      const [newPlayer] = await executeQuery('SELECT * FROM players WHERE id = ?', [rows.insertId])
      return newPlayer.shift()
    } catch (error) {
      throw new Error(error)
    }
  }
}
