import { executeQuery } from '../../utils/executeQuery.js'

export class ProvincesModel {
    static async getProvinces() {
        try {
            const rows = await executeQuery('SELECT * FROM provinces')
            return rows
        } catch (error) {
            throw new Error('Error getting provinces: ' + error.message)
        }
    }

    static async getProvinceById(id) {
        try {
            const rows = await executeQuery('SELECT * FROM provinces WHERE id = ?', [id])
            return rows.shift()
        } catch (error) {
            throw new Error('Error getting province: ' + error.message)
        }
    }
}
