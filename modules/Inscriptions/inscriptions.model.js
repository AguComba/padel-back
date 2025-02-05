import { executeQuery } from '../../utils/executeQuery.js'

export class InscriptionModel {
    static async searchInscriptionByUserID(id) {
        executeQuery('SELECT * FROM inscriptions')
    }
}
