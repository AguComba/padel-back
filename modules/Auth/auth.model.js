import { connection } from '../../config/db.config'

export class AuthModel {
    static async registerUser (user) {
        const [userResult] = await connection.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [user.email, user.password]
        )
        return userResult
    }

    static async getUserByEmail (email) {
        const [user] = await connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )
        return user
    }

    static async getUserById (id) {
        const [user] = await connection.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        )
        return user[0]
    }

    static async loginUser (email, password) {
        const [user] = await connection.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        )
        return user[0]
    }

    static async updateUser (id, user) {
        const [updatedUser] = await connection.query(
            'UPDATE users SET email = ?, password = ? WHERE id = ?',
            [user.email, user.password, id]
        )
        return updatedUser
    }
}
