import { z } from 'zod'

export const InscriptionSchema = z.object({
    id_tournament: z.number({ message: 'El id del torneo es requerido' }).int().positive(),
    id_player_2: z.number({ message: 'El id del jugador 2' }),
    id_player_1: z.number({ message: 'El id del jugador 1' }),
    availablity_days: z.array(z.enum(['L', 'M', 'X', 'J', 'V', 'S', 'D']))
})
