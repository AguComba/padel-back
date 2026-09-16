import { describe, expect, it } from 'vitest'
import { InscriptionSchema, inscriptionUpdateSchema } from '../../schemas/Inscription.schema'

describe('InscriptionSchema', () => {
    const baseInscription = {
        id_tournament: 1,
        id_player_1: 1,
        id_player_2: 2,
        id_club: 1,
        id_category: 1,
        observation: 'Observación de prueba',
        available_hour: '10:00',
        availablity_days: ['L', 'M', 'X'],
        user_created: 1,
        status: 1
    }

    it('dado un objeto valido, pasa la validacion', () => {
        const result = InscriptionSchema.safeParse(baseInscription)

        expect(result.success).toBe(true)
    })

    it('dado un objeto valido con dias de disponibilidad invalidos, falla la validacion y retorna el error correspondiente', () => {
        baseInscription.availablity_days = ['L', 'M', 'X', 'Z']

        const result = InscriptionSchema.safeParse(baseInscription)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toContain('Invalid enum value.')
    })

    it('dado un objeto valido, con valores fuera del enum, falla la validacion y retorna el error correspondiente', () => {
        baseInscription.availablity_days = ['Z']

        const result = inscriptionUpdateSchema.safeParse(baseInscription)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toContain('Invalid enum value.')
    })

    it('dado un objeto valido, con valores fuera del enum, falla la validacion y retorna el error custom', () => {
        baseInscription.availablity_days = 'Z'

        const result = inscriptionUpdateSchema.safeParse(baseInscription)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toContain('Los días deben ser una lista con valores válidos')
    })

    it('dado un objeto valido, con array vacio en availablity_days, falla la validacion y retorna el error custom', () => {
        baseInscription.availablity_days = []

        const result = inscriptionUpdateSchema.safeParse(baseInscription)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toContain('Debes indicar al menos un día de disponibilidad')
    })

    it('dado un objeto valido, con id negativo, falla la validacion y retorna el error custom', () => {
        baseInscription.id_tournament = -1

        const result = InscriptionSchema.safeParse(baseInscription)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toContain('El ID del torneo debe ser positivo')
    })

    it('dado un objeto sin un campo requerido, falla la validacion', () => {
        baseInscription.id_tournament = undefined

        const result = InscriptionSchema.safeParse(baseInscription)

        expect(result.success).toBe(false)
    })
})
