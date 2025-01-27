import { executeQuery } from '../../utils/executeQuery.js'

export class FederationsModel {
    static async getFederations() {
        try {
            const rows = await executeQuery('SELECT * FROM federations')
            return rows
        } catch (error) {
            throw new Error('Error getting federations: ' + error.message)
        }
    }

    static async getFederationById(id) {
        try {
            const rows = await executeQuery('SELECT * FROM federations WHERE id = ?', [id])
            return rows.shift()
        } catch (error) {
            throw new Error('Error getting federation by id: ' + error.message)
        }
    }

    static async createFederation(federation) {
        try {
            const result = await executeQuery(
                'INSERT INTO federations (name, nickname, id_province) VALUES (?, ?, ?)',
                [federation.name, federation.nickname, federation.id_province]
            )
            const federationId = result.insertId
            const [newFederation] = await executeQuery('SELECT * FROM federations WHERE id = ?', [federationId])
            return newFederation
        } catch (error) {
            throw new Error('Error creating federation: ' + error.message)
        }
    }
}
