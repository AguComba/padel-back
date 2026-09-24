import { describe, it, expect } from 'vitest'
import { calcularZonas } from '../../../modules/Zones/zone.logic.js'

const MENSAJE_FUERA_DE_RANGO = 'El numero de parejas debe estar entre 3 y 64.'

// Todas las cantidades validas menos 5, que tiene un bug (ver test mas abajo).
const CANTIDADES_VALIDAS = Array.from({ length: 62 }, (_, i) => i + 3).filter(parejas => parejas !== 5)

describe('Zone logic - calcularZonas', () => {
    it('dado 3 parejas, arma una sola zona de 3', () => {
        const esperado = { zonasDe3: 1, zonasDe4: 0, totalZonas: 1 }

        const zonas = calcularZonas(3)

        expect(zonas).toEqual(esperado)
    })

    it('dado 4 parejas, arma una sola zona de 4', () => {
        const esperado = { zonasDe3: 0, zonasDe4: 1, totalZonas: 1 }

        const zonas = calcularZonas(4)

        expect(zonas).toEqual(esperado)
    })

    it.each([
        [12, { zonasDe3: 4, zonasDe4: 0, totalZonas: 4 }],
        [13, { zonasDe3: 3, zonasDe4: 1, totalZonas: 4 }],
        [14, { zonasDe3: 2, zonasDe4: 2, totalZonas: 4 }],
        [24, { zonasDe3: 8, zonasDe4: 0, totalZonas: 8 }],
        [48, { zonasDe3: 16, zonasDe4: 0, totalZonas: 16 }]
    ])('dado %i parejas, reparte el resto en zonas de 4', (parejas, esperado) => {
        const zonas = calcularZonas(parejas)

        expect(zonas).toEqual(esperado)
    })

    it('dado 49 parejas, se llega al maximo de 16 zonas y el excedente va a una zona de 4', () => {
        const esperado = { zonasDe3: 15, zonasDe4: 1, totalZonas: 16 }

        const zonas = calcularZonas(49)

        expect(zonas).toEqual(esperado)
    })

    it('dado 64 parejas (maximo), arma 16 zonas de 4', () => {
        const esperado = { zonasDe3: 0, zonasDe4: 16, totalZonas: 16 }

        const zonas = calcularZonas(64)

        expect(zonas).toEqual(esperado)
    })

    it.each(CANTIDADES_VALIDAS)('dado %i parejas, todas tienen lugar y no se pasa de 16 zonas', (parejas) => {
        const { zonasDe3, zonasDe4, totalZonas } = calcularZonas(parejas)

        expect(zonasDe3 * 3 + zonasDe4 * 4).toBe(parejas)
        expect(totalZonas).toBe(zonasDe3 + zonasDe4)
        expect(totalZonas).toBeLessThanOrEqual(16)
    })

    // BUG: con 5 parejas arma una sola zona de 4 y la quinta pareja queda afuera.
    it('dado 5 parejas, arma una zona de 4 y deja una pareja afuera (comportamiento actual)', () => {
        const esperado = { zonasDe3: 0, zonasDe4: 1, totalZonas: 1 }

        const zonas = calcularZonas(5)

        expect(zonas).toEqual(esperado)
    })

    // Inconsistencia: fuera de rango devuelve un string en vez de lanzar un error.
    it.each([0, 2, 65, 100])('dado %i parejas (fuera de rango), devuelve un mensaje en vez de lanzar error', (parejas) => {
        const resultado = calcularZonas(parejas)

        expect(resultado).toBe(MENSAJE_FUERA_DE_RANGO)
    })
})
