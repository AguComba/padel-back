import { z } from 'zod'
export const User = z.object({
    id: z
        .number({ message: 'Se debe enviar ID' })
        .positive({ message: 'El ID debe ser positivo' })
        .int({ message: 'El ID debe ser un número entero' }),
    name: z
        .string({ message: 'Se debe enviar un nombre' })
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    last_name: z
        .string({ message: 'Se debe enviar un apellido' })
        .min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    cell_phone: z
        .string({ message: 'Se debe enviar un número de celular' })
        .min(10, { message: 'El número de celular debe tener al menos 10 caracteres' }),
    email: z.string({ message: 'Se debe enviar un correo' }).email({ message: 'El correo debe ser válido' }),
    type_document: z.enum('LE', 'DNI', 'CI', { message: 'El tipo de documento no es valido' }),
    number_document: z
        .string({ message: 'Se debe enviar un número de documento' })
        .min(8, { message: 'El número de documento debe tener al menos 8 caracteres' }),
    gender: z.enum('M', 'F', 'O', { message: 'El género no es valido' }),
    id_city: z
        .number({ message: 'Se debe enviar ID de ciudad' })
        .positive({ message: 'El ID de ciudad debe ser positivo' })
        .int({ message: 'El ID de ciudad debe ser un número entero' }),
    password: z
        .string({ message: 'Se debe enviar una contraseña' })
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
})
export const UserLogin = z.object({
    email: z.string({ message: 'Se debe enviar un correo' }).email({ message: 'El correo debe ser válido' }),
    password: z
        .string({ message: 'Se debe enviar una contraseña' })
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
})

export const UserRegister = z.object({
    name: z
        .string({ message: 'Se debe enviar un nombre' })
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
    last_name: z
        .string({ message: 'Se debe enviar un apellido' })
        .min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    cell_phone: z
        .string({ message: 'Se debe enviar un número de celular' })
        .min(10, { message: 'El número de celular debe tener al menos 10 caracteres' }),
    email: z.string({ message: 'Se debe enviar un correo' }).email({ message: 'El correo debe ser válido' }),
    type_document: z.enum(['LE', 'DNI', 'CI'], { message: 'El tipo de documento no es valido' }),
    number_document: z
        .string({ message: 'Se debe enviar un número de documento' })
        .min(8, { message: 'El número de documento debe tener al menos 8 caracteres' }),
    gender: z.enum(['M', 'F', 'O'], { message: 'El género no es valido' }),
    id_city: z
        .number({ message: 'Se debe enviar ID de ciudad' })
        .positive({ message: 'El ID de ciudad debe ser positivo' })
        .int({ message: 'El ID de ciudad debe ser un número entero' }),
    password: z
        .string({ message: 'Se debe enviar una contraseña' })
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
})

export const UserDocument = z.object({
    number_document: z
        .string({ message: 'Se debe enviar un número de documento' })
        .min(6, { message: 'El número de documento debe tener al menos 6 caracteres' })
})

export const UserEmail = z.object({
    email: z.string({ message: 'El correo enviado no es valido' }).email({ message: 'Verifique el formato del correo' })
})

export const UpdatePassword = z.object({
    id: z
        .number({ message: 'Se debe enviar ID' })
        .positive({ message: 'El ID debe ser positivo' })
        .int({ message: 'El ID debe ser un número entero' }),
    password: z
        .string({ message: 'Se debe enviar una contraseña' })
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
})
