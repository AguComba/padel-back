import { executeQuery } from '../../utils/executeQuery.js'
import { handleTransaction } from '../../utils/transactions.js'

export class UserModel {
  static async searchAllUsers() {
    try {
      const users = await executeQuery(
        `SELECT DISTINCT u.name, last_name, cell_phone, email, number_document, gender, type_user, afiliation, id_category, u.id, c.name as category, ci.name as city FROM users u
                LEFT JOIN players p ON p.id_user = u.id
                LEFT JOIN categories c ON c.id = p.id_category
                LEFT JOIN cities ci ON ci.id = u.id_city
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

  static async getPlayerCategory(idUser) {
    try {
      const playerData = await executeQuery(
        `SELECT p.id, p.id_category FROM players p WHERE p.id_user = ?`,
        [idUser]
      )
      return playerData.length > 0 ? playerData[0] : null
    } catch (error) {
      throw new Error(error)
    }
  }

  static async updatePlayerStatusByCategory(idUser, newCategoryId, oldCategoryId, userGender) {
    return await handleTransaction(async (connection) => {
      const currentYear = new Date().getFullYear()

      // Obtener el ID del jugador
      const [playerData] = await connection.query(
        `SELECT p.id FROM players p WHERE p.id_user = ?`,
        [idUser]
      )

      if (!playerData.length) {
        throw new Error('Jugador no encontrado')
      }

      const playerId = playerData[0].id

      // Si la categoría no cambió, no hacer nada
      if (oldCategoryId === newCategoryId) {
        return false
      }

      // Convertir género a formato de ranking (M -> X, F -> F)
      const rankingGender = userGender === 'M' ? 'X' : 'F'

      // Determinar si es ascenso o descenso y qué categoría buscar
      // Categorías van de peor a mejor: 8,7,6,5,4,3,2,1
      const isAscenso = newCategoryId < oldCategoryId
      const rankingStatus = isAscenso ? 2 : 1
      const categoryToSearch = isAscenso ? oldCategoryId : newCategoryId

      // Buscar en el ranking de la categoría correspondiente
      const [rankingRecord] = await connection.query(
        `SELECT id FROM ranking
         WHERE id_player = ? AND id_category = ? AND year = ? AND gender = ?`,
        [playerId, categoryToSearch, currentYear, rankingGender]
      )

      if (rankingRecord.length > 0) {
        const rankingId = rankingRecord[0].id
        await connection.query(
          `UPDATE ranking SET status = ? WHERE id = ?`,
          [rankingStatus, rankingId]
        )
        return true
      }

      return false
    })
  }
}
