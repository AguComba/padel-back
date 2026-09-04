import { describe, it, expect } from 'vitest'
import { UserLogin, UserRegister } from '../../schemas/User.schema.js'

describe('User schema - UserLogin', () => {
    it('dado un objeto con email y password, valida correctamente', () => {
        const userValid = {
            email: 'test@example.com',
            password: 'password123'
        }

        const result = UserLogin.safeParse(userValid)

        expect(result.success).toBe(true)
    })

    it('dado un objeto con email invalido, falla la validacion', () => {
        const userInvalidEmail = {
            email: 'invalid-email',
            password: 'password123'
        }

        const result = UserLogin.safeParse(userInvalidEmail)

        expect(result.success).toBe(false)
    })

    it('dado un objeto con password demasiado corto, falla la validacion', () => {
        const userInvalidPassword = {
            email: 'test@example.com',
            password: 'short'
        }

        const result = UserLogin.safeParse(userInvalidPassword)

        expect(result.success).toBe(false)
    })

    it('dado un objeto sin email, falla la validacion', () => {
        const userMissingEmail = {
            password: 'password123'
        }

        const result = UserLogin.safeParse(userMissingEmail)

        expect(result.success).toBe(false)
    })
})

describe('User schema - UserRegister', () => {
    it('dado un objeto userRegister con todos los campos requeridos, valida correctamente', () => {
        const userRegisterValid = {
            name: 'John',
            last_name: 'Doe',
            cell_phone: '1234567890',
            email: 'test@example.com',
            type_document: 'DNI',
            number_document: '12345678',
            gender: 'M',
            id_city: 1,
            password: 'password123'
        }

        const result = UserRegister.safeParse(userRegisterValid)

        expect(result.success).toBe(true)
    })

    it('dado un objeto userRegister con email invalido, falla la validacion', () => {
        const userRegisterInvalidEmail = {
            name: 'John',
            last_name: 'Doe',
            cell_phone: '1234567890',
            email: 'invalid-email',
            type_document: 'DNI',
            number_document: '12345678',
            gender: 'M',
            id_city: 1,
            password: 'password123'
        }

        const result = UserRegister.safeParse(userRegisterInvalidEmail)

        expect(result.success).toBe(false)
    })

    it('dado un objeto userRegister con type_document invalido, falla la validacion', () => {
        const userRegisterInvalidTypeDocument = {
            name: 'John',
            last_name: 'Doe',
            cell_phone: '1234567890',
            email: 'test@example.com',
            type_document: 'PASSPORT',
            number_document: '12345678',
            gender: 'M',
            id_city: 1,
            password: 'password123'
        }

        const result = UserRegister.safeParse(userRegisterInvalidTypeDocument)

        expect(result.success).toBe(false)
    })

    it('dado un objeto userRegister con gender invalido, falla la validacion', () => {
        const userRegisterInvalidTypeDocument = {
            name: 'John',
            last_name: 'Doe',
            cell_phone: '1234567890',
            email: 'test@example.com',
            type_document: 'PASSPORT',
            number_document: '12345678',
            gender: 'X',
            id_city: 1,
            password: 'password123'
        }

        const result = UserRegister.safeParse(userRegisterInvalidTypeDocument)

        expect(result.success).toBe(false)
    })

    it('dado un objeto userRegister con password invalido, falla la validacion', () => {
        const userRegisterInvalidTypeDocument = {
            name: 'John',
            last_name: 'Doe',
            cell_phone: '1234567890',
            email: 'test@example.com',
            type_document: 'PASSPORT',
            number_document: '12345678',
            gender: 'X',
            id_city: 1,
            password: 'test'
        }

        const result = UserRegister.safeParse(userRegisterInvalidTypeDocument)

        expect(result.success).toBe(false)
    })
})
