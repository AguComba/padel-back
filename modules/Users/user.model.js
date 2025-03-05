import { executeQuery } from '../../utils/executeQuery.js'
import { handleTransaction } from '../../utils/transactions.js'

export class UserModel {
  static async searchAllUsers() {
    try {
      const users = await executeQuery(
        `SELECT DISTINCT u.name, last_name, cell_phone, email, number_document, gender, type_user, afiliation, id_category, u.id, c.name as category FROM users u
                LEFT JOIN players p ON p.id_user = u.id
                LEFT JOIN categories c ON c.id = p.id_category
                WHERE u.status = 1`,
      )
      return users
    } catch (error) {
      throw new Error(error)
    }
  }

  static async searchUserByDni(dni) {
    try {
      const users = await executeQuery(
        `
                SELECT name, last_name, cell_phone, email, number_document, gender, type_user, c.name as ciudad 
                FROM users 
                INNER JOIN cities c ON c.id = users.id_city
                WHERE number_document = ?`,
        [dni],
      )
      return users
    } catch (error) {
      throw new Error()
    }
  }

  static async updateUserAndPlayer(user) {
    return await handleTransaction(async (connection) => {
      const { id, name, last_name, cell_phone, id_club, possition, hand, id_category } = user

      // Filtrar solo los valores definidos (evita sobreescribir con null o undefined)
      const userUpdate = Object.fromEntries(Object.entries({ name, last_name, cell_phone }).filter(([_, v]) => v !== undefined))
      const playerUpdate = Object.fromEntries(Object.entries({ id_club, possition, hand, id_category }).filter(([_, v]) => v !== undefined))

      let userUpdated = false
      let playerUpdated = false

      if (Object.keys(userUpdate).length > 0) {
        const [rowsUser] = await connection.query(`UPDATE users SET ? WHERE id = ?`, [userUpdate, id])
        userUpdated = rowsUser.affectedRows > 0
      }

      if (Object.keys(playerUpdate).length > 0) {
        const [rowsPlayer] = await connection.query(`UPDATE players SET ? WHERE id_user = ?`, [playerUpdate, id])
        playerUpdated = rowsPlayer.affectedRows > 0
      }

      return userUpdated || playerUpdated
    })
  }
}
