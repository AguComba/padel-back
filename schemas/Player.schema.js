import { z } from 'zod'

export const PlayerSchema = z.object({
    id_user: z.number({ message: 'el id user es requerido' }).int().positive(),
    id_category: z.number({ message: 'Debe enviar el id la categoria' }).int().positive(),
    id_club: z.number({ message: 'Debe enviar el id del club' }).int().positive(),
    possition: z.enum(['DRIVE', 'REVES']).optional(),
    hand: z.enum(['DERECHA', 'IZQUIERDA']).optional(),
    afiliation: z.boolean({ message: 'Debe enviar si esta afiliado o no' }),
    updated_at: z.string({ message: 'La fecha debeser un string' }).optional(),
    user_updated: z.number({ message: 'El id del usuario debe ser un entero' }).int().positive().optional()
})
