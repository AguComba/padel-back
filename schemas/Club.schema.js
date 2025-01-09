import { z } from 'zod'

export const ClubSchema = z.object({
  id: z.number({ message: 'El id debe ser un numero' }).int().positive().optional(),
  name: z.string({ message: 'El nombre es requerido' }).min(1).max(150),
  id_city: z.number({ message: 'el id city debe ser numero' }).int().positive(),
  id_federation: z.number({ message: 'el id federation debe ser numero' }).int().positive(),
  status: z.number({ message: 'el status debe ser numero' }).int().positive().default(1),
  user_created: z.number({ message: 'el id del usuario debe ser numero' }).int().positive(),
  courts: z.number({ message: 'las canchas deben ser un numero' }).int().positive(),
  id_administrator: z.number({ message: 'el id administrador debe ser numero' }).int().positive(),
})
