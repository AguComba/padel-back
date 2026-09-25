import { describe, it, expect } from 'vitest'
import {
    calcularZonas,
    orderCouples,
    searchTopCouples,
    searchSecondCouples,
    searchThirdCouples,
    searchFourthCouples,
    generarZonas
} from '../../../modules/Zones/zone.logic.js'
import { crearParejas, ids, idsPorZona, idsEnZonas } from '../../helpers/zones.js'

// Un torneo se juega con un minimo de 6 parejas y un maximo de 64.
const CANTIDADES_VALIDAS = Array.from({ length: 59 }, (_, i) => i + 6)

describe('Zone logic - calcularZonas', () => {
    it('dado 6 parejas (minimo), arma dos zonas de 3', () => {
        const esperado = { zonasDe3: 2, zonasDe4: 0, totalZonas: 2 }

        const zonas = calcularZonas(6)

        expect(zonas).toEqual(esperado)
    })

    it.each([
        [7, { zonasDe3: 1, zonasDe4: 1, totalZonas: 2 }],
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

    it.each([
        [0, 'No se alcanzó el mínimo de 6 parejas para disputar el torneo (hay 0 inscriptas).'],
        [5, 'No se alcanzó el mínimo de 6 parejas para disputar el torneo (hay 5 inscriptas).']
    ])('dado %i parejas (menos del minimo), lanza un error', (parejas, mensaje) => {
        const calcular = () => calcularZonas(parejas)

        expect(calcular).toThrow(mensaje)
    })

    it.each([
        [65, 'No se puede armar un torneo con más de 64 parejas (hay 65 inscriptas).'],
        [100, 'No se puede armar un torneo con más de 64 parejas (hay 100 inscriptas).']
    ])('dado %i parejas (mas del maximo), lanza un error', (parejas, mensaje) => {
        const calcular = () => calcularZonas(parejas)

        expect(calcular).toThrow(mensaje)
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
        [6, 2, [1, 2]],
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
        [6, 2, [3, 4]],
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
        [6, 2, [5, 6]],
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
        [7, 2, 1, [7]],
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

describe('Zone logic - generarZonas', () => {
    it('dado 6 parejas (minimo), arma las zonas A y B de 3 parejas y sin partidos', async() => {
        const parejas = crearParejas(6)
        const esperado = [
            { nombre: 'A', parejas: [parejas[0], parejas[3], parejas[4]], partidos: [] },
            { nombre: 'B', parejas: [parejas[1], parejas[2], parejas[5]], partidos: [] }
        ]

        const zonas = await generarZonas(parejas)

        expect(zonas).toEqual(esperado)
    })

    it('dado 7 parejas, la septima completa la zona A como zona de 4', async() => {
        const parejas = crearParejas(7)
        const esperado = {
            A: [1, 4, 5, 7],
            B: [2, 3, 6]
        }

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas)).toEqual(esperado)
    })

    it('dado 12 parejas, cada zona tiene una cabeza de serie, la segunda de abajo hacia arriba y la tercera de arriba hacia abajo', async() => {
        const parejas = crearParejas(12)
        const esperado = {
            A: [1, 8, 9],
            B: [2, 7, 10],
            C: [3, 6, 11],
            D: [4, 5, 12]
        }

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas)).toEqual(esperado)
    })

    it('dado 14 parejas, las cuartas parejas van a las primeras zonas, la mejor a la zona A', async() => {
        const parejas = crearParejas(14)
        const esperado = {
            A: [1, 8, 9, 13],
            B: [2, 7, 10, 14],
            C: [3, 6, 11],
            D: [4, 5, 12]
        }

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas)).toEqual(esperado)
    })

    it('dado 49 parejas, la unica cuarta pareja va a la ultima zona (P)', async() => {
        const parejas = crearParejas(49)

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas).A).toEqual([1, 32, 33])
        expect(idsPorZona(zonas).P).toEqual([16, 17, 48, 49])
    })

    it('dado 50 parejas, las cuartas se cargan desde la zona P hacia atras, la peor en la P', async() => {
        const parejas = crearParejas(50)

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas).O).toEqual([15, 18, 47, 49])
        expect(idsPorZona(zonas).P).toEqual([16, 17, 48, 50])
    })

    it('dado 64 parejas, arma 16 zonas de 4 y la mejor cuarta pareja va a la zona A', async() => {
        const parejas = crearParejas(64)

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas).A).toEqual([1, 32, 33, 49])
        expect(idsPorZona(zonas).P).toEqual([16, 17, 48, 64])
    })

    it('dado 64 parejas, nombra las zonas de la A a la P', async() => {
        const parejas = crearParejas(64)
        const esperado = 'ABCDEFGHIJKLMNOP'.split('')

        const zonas = await generarZonas(parejas)

        expect(Object.keys(idsPorZona(zonas))).toEqual(esperado)
    })

    it('dado parejas rankeadas que llegan desordenadas, las ordena por puntaje antes de armar las zonas', async() => {
        const parejas = crearParejas(12).reverse().map(pareja => ({ ...pareja, ranked: 1 }))
        const esperado = {
            A: [1, 8, 9],
            B: [2, 7, 10],
            C: [3, 6, 11],
            D: [4, 5, 12]
        }

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas)).toEqual(esperado)
    })

    it('dado parejas sin rankear, toma las cabezas de serie en el orden recibido', async() => {
        const parejas = crearParejas(12).reverse()
        const esperado = {
            A: [12, 8, 1],
            B: [11, 7, 2],
            C: [10, 6, 3],
            D: [9, 5, 4]
        }

        const zonas = await generarZonas(parejas)

        expect(idsPorZona(zonas)).toEqual(esperado)
    })

    it.each(CANTIDADES_VALIDAS)('dado %i parejas, cada pareja queda en una sola zona', async(cantidad) => {
        const parejas = crearParejas(cantidad)
        const esperado = ids(parejas)

        const zonas = await generarZonas(parejas)

        expect(idsEnZonas(zonas)).toEqual(esperado)
    })

    it('dado 5 parejas (menos del minimo), rechaza con el error de minimo', async() => {
        const parejas = crearParejas(5)
        const mensaje = 'No se alcanzó el mínimo de 6 parejas para disputar el torneo (hay 5 inscriptas).'

        const resultado = generarZonas(parejas)

        await expect(resultado).rejects.toThrow(mensaje)
    })

    it('dado 65 parejas (mas del maximo), rechaza con el error de maximo', async() => {
        const parejas = crearParejas(65)
        const mensaje = 'No se puede armar un torneo con más de 64 parejas (hay 65 inscriptas).'

        const resultado = generarZonas(parejas)

        await expect(resultado).rejects.toThrow(mensaje)
    })
})
