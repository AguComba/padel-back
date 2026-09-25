import { describe, it, expect } from 'vitest'
import {
    calcularZonas,
    orderCouples,
    searchTopCouples,
    searchSecondCouples,
    searchThirdCouples,
    searchFourthCouples
} from '../../../modules/Zones/zone.logic.js'
import { crearParejas, ids } from '../../helpers/zones.js'

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

describe('Zone logic - orderCouples', () => {
    it('dado parejas desordenadas, las ordena de mayor a menor puntaje', () => {
        const parejas = [
            { id: 1, puntos_totales: 50 },
            { id: 2, puntos_totales: 200 },
            { id: 3, puntos_totales: 0 },
            { id: 4, puntos_totales: 120 }
        ]
        const esperado = [2, 4, 1, 3]

        const ordenadas = orderCouples(parejas)

        expect(ids(ordenadas)).toEqual(esperado)
    })

    it('dado parejas con el mismo puntaje, respeta el orden en que llegaron', () => {
        const parejas = [
            { id: 1, puntos_totales: 100 },
            { id: 2, puntos_totales: 300 },
            { id: 3, puntos_totales: 100 },
            { id: 4, puntos_totales: 100 }
        ]
        const esperado = [2, 1, 3, 4]

        const ordenadas = orderCouples(parejas)

        expect(ids(ordenadas)).toEqual(esperado)
    })

    // Inconsistencia: ordena el array recibido en lugar de devolver una copia.
    it('dado un array de parejas, lo ordena en el lugar y devuelve la misma referencia (comportamiento actual)', () => {
        const parejas = [
            { id: 1, puntos_totales: 10 },
            { id: 2, puntos_totales: 20 }
        ]

        const ordenadas = orderCouples(parejas)

        expect(ordenadas).toBe(parejas)
    })

    it('dado un array vacio, devuelve un array vacio', () => {
        const parejas = []

        const ordenadas = orderCouples(parejas)

        expect(ordenadas).toEqual([])
    })
})

describe('Zone logic - searchTopCouples', () => {
    it.each([
        [3, 1, [1]],
        [13, 4, [1, 2, 3, 4]],
        [64, 16, Array.from({ length: 16 }, (_, i) => i + 1)]
    ])('dado %i parejas y %i zonas, devuelve las primeras como cabezas de serie', (cantidad, totalZonas, esperado) => {
        const parejas = crearParejas(cantidad)

        const cabezas = searchTopCouples(parejas, totalZonas)

        expect(ids(cabezas)).toEqual(esperado)
    })

    it('dado un array de parejas, no lo modifica', () => {
        const parejas = crearParejas(13)
        const copia = structuredClone(parejas)

        searchTopCouples(parejas, 4)

        expect(parejas).toEqual(copia)
    })
})

describe('Zone logic - searchSecondCouples', () => {
    it.each([
        [3, 1, [2]],
        [13, 4, [5, 6, 7, 8]],
        [64, 16, Array.from({ length: 16 }, (_, i) => i + 17)]
    ])('dado %i parejas y %i zonas, devuelve el segundo tramo', (cantidad, totalZonas, esperado) => {
        const parejas = crearParejas(cantidad)

        const segundas = searchSecondCouples(parejas, totalZonas)

        expect(ids(segundas)).toEqual(esperado)
    })
})

describe('Zone logic - searchThirdCouples', () => {
    it.each([
        [3, 1, [3]],
        [13, 4, [9, 10, 11, 12]],
        [64, 16, Array.from({ length: 16 }, (_, i) => i + 33)]
    ])('dado %i parejas y %i zonas, devuelve el tercer tramo', (cantidad, totalZonas, esperado) => {
        const parejas = crearParejas(cantidad)

        const terceras = searchThirdCouples(parejas, totalZonas)

        expect(ids(terceras)).toEqual(esperado)
    })
})

describe('Zone logic - searchFourthCouples', () => {
    it.each([
        [4, 1, 1, [4]],
        [13, 4, 1, [13]],
        [14, 4, 2, [13, 14]],
        [49, 16, 1, [49]],
        [64, 16, 16, Array.from({ length: 16 }, (_, i) => i + 49)]
    ])('dado %i parejas, %i zonas y %i zonas de 4, devuelve las parejas sobrantes', (cantidad, totalZonas, zonasDe4, esperado) => {
        const parejas = crearParejas(cantidad)

        const cuartas = searchFourthCouples(parejas, totalZonas, zonasDe4)

        expect(ids(cuartas)).toEqual(esperado)
    })

    it('dado ninguna zona de 4, devuelve un array vacio', () => {
        const parejas = crearParejas(12)

        const cuartas = searchFourthCouples(parejas, 4, 0)

        expect(cuartas).toEqual([])
    })
})
