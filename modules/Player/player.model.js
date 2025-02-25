import { executeQuery } from '../../utils/executeQuery.js'
export class PlayerModel {
    static async search() {
        try {
            const rows = await executeQuery(
                `SELECT u.id, p.possition, p.hand, cat.name as category, c.name as club, u.name, u.last_name, p.afiliation FROM players p
                inner join categories cat on p.id_category = cat.id 
                inner join users u on p.id_user = u.id 
                inner join clubs c on p.id_club = c.id
                GROUP BY u.id, p.possition, p.hand, cat.name, c.name, u.name, u.last_name, p.afiliation
                `
            )
            return rows
        } catch (error) {
            throw new Error(error)
        }
    }

    static async searchById(id) {
        try {
            const rows = await executeQuery(
                `SELECT p.id, p.possition, p.hand, cat.id as id_cat ,cat.name as category, c.id as id_club ,c.name as club, u.name, u.last_name, p.afiliation, u.gender FROM players p
         inner join categories cat on p.id_category = cat.id 
         inner join users u on p.id_user = u.id 
         inner join clubs c on p.id_club = c.id
         where p.id = ?`,
                [id]
            )
            return rows.shift()
        } catch (error) {
            throw new Error(error)
        }
    }
    static async searchByIdUserAfiliated(id) {
        try {
            const rows = await executeQuery(
                `SELECT p.id, p.possition, p.hand, cat.id as id_cat,cat.name as category, c.id as id_club, c.name as club, u.name, u.last_name FROM players p
         inner join categories cat on p.id_category = cat.id 
         inner join users u on p.id_user = u.id 
         inner join clubs c on p.id_club = c.id
         where u.id = ? AND afiliation = 1`,
                [id]
            )
            return rows.shift()
        } catch (error) {
            throw new Error(error)
        }
    }

    static async searchByIdUser(id) {
        try {
            const rows = await executeQuery(
                `SELECT p.id, p.possition, p.hand, cat.id as id_cat,cat.name as category, c.id as id_club, c.name as club, u.name, u.last_name, p.afiliation, u.cell_phone FROM players p
         inner join categories cat on p.id_category = cat.id 
         inner join users u on p.id_user = u.id 
         inner join clubs c on p.id_club = c.id
         where u.id = ?`,
                [id]
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
                [id]
            )
            return rows
        } catch (error) {
            throw new Error(error)
        }
    }

    static async searchByDni(dni) {
        try {
            const rows = await executeQuery(
                `SELECT p.id, p.possition, p.hand, p.afiliation,cat.name as category, u.name, u.last_name FROM users u 
                inner join players p on p.id_user = u.id 
                inner join categories cat on p.id_category = cat.id 
                WHERE u.number_document = ?
            `,
                [dni]
            )
            return rows.shift()
        } catch (error) {
            throw new Error(error)
        }
    }

    static async create(player) {
        try {
            const rows = await executeQuery(
                `INSERT INTO players (id_user, id_category, possition, hand, afiliation, id_club) VALUES (?, ?, ?, ?, ?, ?)`,
                [player.id_user, player.id_category, player.possition, player.hand, player.afiliation, player.id_club]
            )
            const newPlayer = await executeQuery('SELECT * FROM players WHERE id = ?', [rows.insertId])
            return newPlayer.shift()
        } catch (error) {
            throw new Error(error)
        }
    }
}
