import { describe, it, expect } from 'vitest'
import { UserLogin, UserRegister, User } from '../../schemas/User.schema.js'

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
