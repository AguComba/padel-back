import { describe, expect, it } from 'vitest'
import { hasRole } from '../../middlewares/permisions.js'
import { buildUser } from '../helpers/auth.js'

describe('hasRole', () => {
    it('devuelve true si el usuario tiene el rol requerido', () => {
        const userAdmin = buildUser({ role: 'admin' })
        const userPlayer = buildUser({ id: 2, role: 'player' })

        expect(hasRole(userAdmin, ['admin'])).toBe(true)
        expect(hasRole(userPlayer, ['player'])).toBe(true)
    })

    it('devuelve true si el usuario tiene uno de los roles requeridos', () => {
        const userAdmin = buildUser({ role: 'admin' })

        expect(hasRole(userAdmin, ['player', 'admin'])).toBe(true)
    })

    it('devuelve false si el usuario no tiene el rol requerido', () => {
        const userAdmin = buildUser({ role: 'admin' })
        const userPlayer = buildUser({ id: 2, role: 'player' })

        expect(hasRole(userAdmin, ['player'])).toBe(false)
        expect(hasRole(userPlayer, ['admin'])).toBe(false)
    })

    it('devuelve false si el usuario es nulo o indefinido', () => {
        expect(hasRole(null, ['admin'])).toBe(false)
        expect(hasRole(undefined, ['player'])).toBe(false)
    })

    it('devuelve false si el rol del usuario es null', () => {
        const userWithoutRole = buildUser({ role: null })
        expect(hasRole(userWithoutRole, ['admin'])).toBe(false)
    })

    it('devuelve false si el rol del usuario es undefined', () => {
        // Se harcodea ya que buildUser al recibir role: undefined, lo reemplaza por el rol por defecto.
        const userWithoutRole = { role: undefined }
        expect(hasRole(userWithoutRole, ['admin'])).toBe(false)
    })

    it('devuelve false si el rol no esta en el diccionario', () => {
        const userWithUnknownRole = buildUser({ role: 'unknown' })
        expect(hasRole(userWithUnknownRole, ['admin'])).toBe(false)
    })
})
