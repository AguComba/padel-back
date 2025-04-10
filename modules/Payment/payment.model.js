import { executeQuery } from '../../utils/executeQuery.js'

export class PaymentModel {
    static async create(data) {
        try {
            const rows = await executeQuery(
                `INSERT INTO payments (id_user, amount, type, status, entity) VALUES (?, ?, ?, ?, ?)`,
                [data.id_user, data.amount, data.type, data.status, data.entity]
            )
            const type = data.type === 'AFILIACION' ? 'A' : 'I'
            const id = data.transaction_id || rows.insertId
            const transaction_id = id.toString().padStart(8, '0') + type

            await executeQuery(`UPDATE payments SET transaction_id = ? WHERE id = ?`, [transaction_id, rows.insertId])
            return transaction_id
        } catch (error) {
            throw new Error(error)
        }
    }

    static async update(data) {
        try {
            await executeQuery(
                `UPDATE payments SET status = ?, message = ?, external_id = ? WHERE transaction_id = ?`,
                [data.status, data.message, data.external_id, data.transaction_id]
            )
            if (parseInt(data.status) === 1) {
                const row = await executeQuery(`SELECT * FROM payments WHERE transaction_id = ?`, [data.transaction_id])
                const payment = row.shift()
                if (payment && payment.type === 'AFILIACION') {
                    await executeQuery(`UPDATE players SET afiliation = 1 WHERE id_user = ?`, [payment.id_user])
                }
                if (payment && payment.type === 'INSCRIPCION') {
                    const transaction = parseInt(payment.transaction_id)
                    await executeQuery(`UPDATE inscriptions SET status_payment = 'PAID' WHERE id = ?`, [transaction])
                }
                return payment
            } else {
                return data
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}
