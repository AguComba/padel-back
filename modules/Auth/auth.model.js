import bcrypt from 'bcrypt'
import { executeQuery } from '../../utils/executeQuery.js'

export class AuthModel {
    static async registerUser(user) {
        try {
            const userResult = await executeQuery(
                'INSERT INTO users (name, last_name, cell_phone, email, type_document, number_document, gender, id_city, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    user.name.toUpperCase(),
                    user.last_name.toUpperCase(),
                    user.cell_phone,
                    user.email,
                    user.type_document,
                    user.number_document,
                    user.gender,
                    user.id_city,
                    user.password
                ]
            )
            const userId = userResult.insertId
            const [newUser] = await executeQuery('SELECT * FROM users WHERE id = ?', [userId])
            return newUser
        } catch (error) {
            throw new Error('Error registering user: ' + error.message)
        }
    }

    static async getUserByEmail(email) {
        try {
            const user = await executeQuery('SELECT * FROM users WHERE email = ?', [email])
            return user
        } catch (error) {
            throw new Error('Error fetching user by email: ' + error.message)
        }
    }

    static async getUserById(id) {
        try {
            const user = await executeQuery('SELECT * FROM users WHERE id = ?', [id])
            return user.shift()
        } catch (error) {
            throw new Error('Error fetching user by ID: ' + error.message)
        }
    }

    static async loginUser(email) {
        try {
            const user = await executeQuery('SELECT * FROM users WHERE email = ?', [email])
            return user.shift()
        } catch (error) {
            throw new Error('Error logging in user: ' + error.message)
        }
    }

    static async updateUser(id, user) {
        try {
            const updatedUser = await executeQuery('UPDATE users SET email = ?, password = ? WHERE id = ?', [
                user.email,
                user.password,
                id
            ])
            return updatedUser
        } catch (error) {
            throw new Error('Error updating user: ' + error.message)
        }
    }

    static async hashPassword(password) {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword
    }
}
