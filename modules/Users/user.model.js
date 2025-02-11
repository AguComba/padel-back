import { executeQuery } from '../../utils/executeQuery.js'

export class UserModel {
    static async searchAllUsers() {
        try {
            const users = await executeQuery(
                `SELECT DISTINCT name, last_name, cell_phone, email, number_document, gender, type_user, afiliation FROM users u
                LEFT JOIN players p ON p.id_user = u.id
                WHERE u.status = 1`
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
                [dni]
            )
            return users
        } catch (error) {
            throw new Error()
        }
    }
}
