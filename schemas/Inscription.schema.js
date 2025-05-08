import { z } from 'zod'

/**
 * Enum para los días de disponibilidad válidos
 */
export const availablityDaysEnum = z.enum(['L', 'M', 'X', 'J', 'V', 'S', 'D'])

/**
 * Esquema completo para crear una inscripción
 */
export const InscriptionSchema = z.object({
    id_tournament: z.number()
        .int({ message: 'El ID del torneo debe ser un número entero' })
        .positive({ message: 'El ID del torneo debe ser positivo' })
        .describe('ID del torneo al que se inscribe la pareja'),

    id_player_1: z.number()
        .int({ message: 'El ID del jugador 1 debe ser entero' })
        .positive({ message: 'El ID del jugador 1 debe ser positivo' }),

    id_player_2: z.number()
        .int({ message: 'El ID del jugador 2 debe ser entero' })
        .positive({ message: 'El ID del jugador 2 debe ser positivo' }),

    id_club: z.number()
        .int({ message: 'El ID del club debe ser entero' })
        .positive({ message: 'El ID del club debe ser positivo' }),

    id_category: z.number()
        .int({ message: 'El ID de la categoría debe ser entero' })
        .positive({ message: 'El ID de la categoría debe ser positivo' }),

    observation: z.string()
        .max(250, { message: 'La observación no puede tener más de 250 caracteres' })
        .optional(),

    availablity_days: z.array(availablityDaysEnum, {
        required_error: 'Debes indicar los días de disponibilidad',
        invalid_type_error: 'Los días deben ser una lista con valores válidos (L, M, X, J, V, S, D)',
    }),

    user_created: z.number()
        .int({ message: 'El ID del usuario debe ser entero' })
        .positive({ message: 'El ID del usuario debe ser positivo' }),

    status: z.number()
        .int({ message: 'El estado debe ser un número entero' })
        .describe('Estado de la inscripción')
})

/**
 * Esquema base sin campos de sistema
 * útil para extender en otros esquemas como el de update
 */
export const baseInscriptionSchema = InscriptionSchema.omit({
    user_created: true,
    status: true,
})

/**
 * Esquema para actualizar una inscripción
 * Todos los campos opcionales
 */
export const inscriptionUpdateSchema = baseInscriptionSchema.partial()
