import { connection } from '../../config/db.config.js'
import bcrypt from 'bcrypt'

export class AuthModel {
  static async registerUser(user) {
    try {
      const [userResult] = await connection.query('INSERT INTO users (name, last_name, cell_phone, email, type_document, number_document, gender, id_city, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        user.name.toUpperCase(),
        user.last_name.toUpperCase(),
        user.cell_phone,
        user.email,
        user.type_document,
        user.number_document,
        user.gender,
        user.id_city,
        user.password,
      ])
      const userId = userResult.insertId
      const [newUser] = await connection.query('SELECT * FROM users WHERE id = ?', [userId])
      return newUser[0]
    } catch (error) {
      throw new Error('Error registering user: ' + error.message)
    }
  }

  static async getUserByEmail(email) {
    const [user] = await connection.query('SELECT * FROM users WHERE email = ?', [email])
    return user
  }

  static async getUserById(id) {
    const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [id])
    return user.shift()
  }

  static async loginUser(email) {
    try {
      const [user] = await connection.query('SELECT * FROM users WHERE email = ?', [email])
      return user.shift()
    } catch (error) {
      throw new Error('Error logging in user: ' + error.message)
    }
  }

  static async updateUser(id, user) {
    const [updatedUser] = await connection.query('UPDATE users SET email = ?, password = ? WHERE id = ?', [user.email, user.password, id])
    return updatedUser
  }

  static async hashPassword(password) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  }
}
