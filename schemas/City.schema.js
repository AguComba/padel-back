import { z } from 'zod'

export const City = z.object({
  name: z.string({ message: 'Se debe enviar un nombre' }).min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  zip_code: z.string({ message: 'Se debe enviar un código postal' }).min(4, { message: 'El código postal debe tener al menos 4 caracteres' }),
  id_province: z.number({ message: 'Se debe enviar ID de provincia' }).positive({ message: 'El ID de provincia debe ser positivo' }).int({ message: 'El ID de provincia debe ser un número entero' }),
})
