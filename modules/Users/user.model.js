import { executeQuery } from '../../utils/executeQuery.js'

export class UserModel {
    static async searchAllUsers() {
        try {
            const users = await executeQuery(
                'SELECT name, last_name, cell_phone, email, number_document, gender, type_user FROM users WHERE status = 1'
            )
            return users
        } catch (error) {
            throw new Error()
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
            console.log(users)
            return users
        } catch (error) {
            throw new Error()
        }
    }
}
