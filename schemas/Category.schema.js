import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.number({ message: 'El id debe ser un entero' }).optional(),
  name: z.string({ message: 'El nombre debe ser un texto' }).min(3).max(255),
  status: z.union([z.literal(0), z.literal(1)], { message: 'El estado enviado no es valido' }).optional(),
  user_updated: z.number({ message: 'El id del usuario debe ser un entero' }).optional(),
})

export const updatedCategorySchema = z.object({
  id: z.number({ message: 'El id debe ser un entero' }),
  status: z.union([z.literal(0), z.literal(1)], { message: 'El estado enviado no es valido' }),
})
