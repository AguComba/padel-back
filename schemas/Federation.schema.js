import { z } from 'zod'

export const FederationSchema = z.object({
  name: z.string({ message: 'El nombre de la federacion es requerido' }).trim().min(1),
  nickname: z.string({ message: 'El nombre corto de la federacion es requerido' }).trim().min(1),
  id_province: z.number({ message: 'El id de la provincia es requerido' }).int().positive(),
})
