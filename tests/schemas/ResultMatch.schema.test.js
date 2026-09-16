import { describe, it, expect } from 'vitest'
import { resultMatchSchema } from '../../modules/Results/Infrastructure/resultMatchSchema.js'

const baseMatch = {
    first_set_couple1: 6,
    first_set_couple2: 4,
    second_set_couple1: 3,
    second_set_couple2: 6,
    third_set_couple1: 7,
    third_set_couple2: 5,
    winner_couple: 1,
    wo: 0,
    result_string: '6-4, 3-6, 7-5',
    id_match: 123,
    user_created: 1,
    user_updated: 1,
    match_type: 'zona'
}

const baseNextMatch = {
    id: 1,
    id_couple1: 1,
    points_couple1: null,
    id_couple2: 2,
    points_couple2: null
}

describe('resultMatchSchema', () => {
    it('dado un objeto valido, pasa la validacion', () => {
        const result = resultMatchSchema.safeParse(baseMatch)

        expect(result.success).toBe(true)
    })

    it('dado un partido de dos sets, con el tercero en null, pasa la validacion', () => {
        const result = resultMatchSchema.safeParse({
            ...baseMatch,
            third_set_couple1: null,
            third_set_couple2: null,
            result_string: '6-4, 6-3'
        })

        expect(result.success).toBe(true)
    })

    it('dado un partido de dos sets, sin enviar el tercero, pasa la validacion', () => {
        const { third_set_couple1: _c1, third_set_couple2: _c2, ...twoSets } = baseMatch

        const result = resultMatchSchema.safeParse(twoSets)

        expect(result.success).toBe(true)
        expect(result.data.third_set_couple1).toBeUndefined()
        expect(result.data.third_set_couple2).toBeUndefined()
    })

    it('dado un set con un numero decimal, falla la validacion', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, first_set_couple1: 6.5 })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['first_set_couple1'])
    })

    it('dado un set como string, falla la validacion (no hay coercion)', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, first_set_couple1: '6' })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['first_set_couple1'])
    })
})

describe('resultMatchSchema - wo', () => {
    it('dado un objeto sin wo, toma el valor por defecto 0', () => {
        const { wo: _wo, ...sinWo } = baseMatch

        const result = resultMatchSchema.safeParse(sinWo)

        expect(result.success).toBe(true)
        expect(result.data.wo).toBe(0)
    })

    it('dado un objeto con wo en 1, respeta el valor enviado', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, wo: 1 })

        expect(result.success).toBe(true)
        expect(result.data.wo).toBe(1)
    })

    it('dado un objeto con wo en undefined, toma el valor por defecto 0', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, wo: undefined })

        expect(result.success).toBe(true)
        expect(result.data.wo).toBe(0)
    })

    it('dado un wo en null, falla la validacion porque no es nullable', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, wo: null })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['wo'])
    })
})

describe('resultMatchSchema - match_type', () => {
    it.each(['zona', 'cuadro'])('dado match_type "%s", pasa la validacion', (matchType) => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, match_type: matchType })

        expect(result.success).toBe(true)
    })

    it('dado un match_type fuera del enum, falla la validacion', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, match_type: 'final' })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].message).toContain('Invalid enum value.')
    })

    it('dado un objeto sin match_type, falla la validacion', () => {
        const { match_type: _matchType, ...sinTipo } = baseMatch

        const result = resultMatchSchema.safeParse(sinTipo)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['match_type'])
    })
})

describe('resultMatchSchema - campos requeridos', () => {
    it.each([
        'winner_couple',
        'result_string',
        'id_match',
        'user_created',
        'user_updated'
    ])('dado un objeto sin %s, falla la validacion', (campo) => {
        const { [campo]: _omitido, ...incompleto } = baseMatch

        const result = resultMatchSchema.safeParse(incompleto)

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual([campo])
    })

    it('dado un result_string vacio, falla la validacion', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, result_string: '' })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['result_string'])
    })
})

describe('resultMatchSchema - fechas', () => {
    it('dado created_at y updated_at como string ISO, los convierte a Date', () => {
        const result = resultMatchSchema.safeParse({
            ...baseMatch,
            created_at: '2026-01-15T10:00:00.000Z',
            updated_at: '2026-01-15T10:00:00.000Z'
        })

        expect(result.success).toBe(true)
        expect(result.data.created_at).toBeInstanceOf(Date)
        expect(result.data.updated_at).toBeInstanceOf(Date)
    })

    it('dado un created_at que no es una fecha valida, falla la validacion', () => {
        const result = resultMatchSchema.safeParse({ ...baseMatch, created_at: 'no-es-fecha' })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['created_at'])
    })
})

describe('resultMatchSchema - winnerNextMatch / loserNextMatch', () => {
    it('dado un objeto con ambos next match validos, pasa la validacion', () => {
        const result = resultMatchSchema.safeParse({
            ...baseMatch,
            winnerNextMatch: baseNextMatch,
            loserNextMatch: { ...baseNextMatch, id: 2 }
        })

        expect(result.success).toBe(true)
    })

    it('dado un next match con parejas y puntos en null, pasa la validacion', () => {
        const result = resultMatchSchema.safeParse({
            ...baseMatch,
            winnerNextMatch: {
                id: 1,
                id_couple1: null,
                points_couple1: null,
                id_couple2: null,
                points_couple2: null
            }
        })

        expect(result.success).toBe(true)
    })

    it('dado un next match sin id, falla la validacion', () => {
        const { id: _id, ...sinId } = baseNextMatch

        const result = resultMatchSchema.safeParse({ ...baseMatch, winnerNextMatch: sinId })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['winnerNextMatch', 'id'])
    })

    it('dado un next match con id en null, falla la validacion porque no es nullable', () => {
        const result = resultMatchSchema.safeParse({
            ...baseMatch,
            loserNextMatch: { ...baseNextMatch, id: null }
        })

        expect(result.success).toBe(false)
        expect(result.error.issues[0].path).toEqual(['loserNextMatch', 'id'])
    })

    it('dado un objeto sin next match, pasa la validacion', () => {
        const result = resultMatchSchema.safeParse(baseMatch)

        expect(result.success).toBe(true)
        expect(result.data.winnerNextMatch).toBeUndefined()
        expect(result.data.loserNextMatch).toBeUndefined()
    })
})
