import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaymentModel } from '../../../modules/Payment/payment.model.js'
import { executeQuery } from '../../../utils/executeQuery.js'

vi.mock('../../../utils/executeQuery.js', () => ({ executeQuery: vi.fn() }))

const basePayment = {
    id_user: 1,
    amount: 15000,
    type: 'INSCRIPCION',
    status: 0,
    entity: 'MACRO'
}

describe('PaymentModel.create - formato de transaction_id', () => {
    beforeEach(() => {
        vi.mocked(executeQuery).mockReset()
    })

    it('dado un pago de AFILIACION, arma el transaction_id con 8 digitos y el sufijo A', async() => {
        vi.mocked(executeQuery)
            .mockResolvedValueOnce({ insertId: 42 })
            .mockResolvedValueOnce(undefined)

        const transactionId = await PaymentModel.create({ ...basePayment, type: 'AFILIACION' })

        expect(transactionId).toBe('00000042A')
    })

    it('dado un pago de INSCRIPCION, arma el transaction_id con 8 digitos y el sufijo I', async() => {
        vi.mocked(executeQuery)
            .mockResolvedValueOnce({ insertId: 42 })
            .mockResolvedValueOnce(undefined)

        const transactionId = await PaymentModel.create(basePayment)

        expect(transactionId).toBe('00000042I')
    })

    it('dado un transaction_id en la data, pisa al insertId', async() => {
        vi.mocked(executeQuery)
            .mockResolvedValueOnce({ insertId: 42 })
            .mockResolvedValueOnce(undefined)

        const transactionId = await PaymentModel.create({ ...basePayment, transaction_id: 7 })

        expect(transactionId).toBe('00000007I')
    })

    it('dado un pago creado, actualiza la fila del insertId con el transaction_id generado', async() => {
        vi.mocked(executeQuery)
            .mockResolvedValueOnce({ insertId: 42 })
            .mockResolvedValueOnce(undefined)

        await PaymentModel.create({ ...basePayment, transaction_id: 7 })

        expect(vi.mocked(executeQuery).mock.calls[1][0]).toContain('UPDATE payments SET transaction_id')
        expect(vi.mocked(executeQuery).mock.calls[1][1]).toEqual(['00000007I', 42])
    })
})
