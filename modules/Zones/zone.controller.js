import { isAdmin } from '../../middlewares/permisions.js'
import { CouplesModel } from '../Couples/couples.model.js'
// import { parejas, parejas4, parejasSuma6 } from './couples.js'

function calcularZonas(parejas) {
    if (parejas < 3 || parejas > 64) {
        return 'El numero de parejas debe estar entre 3 y 64.'
    }

    const maxZonas = 16
    const parejasPorZona3 = 3
    const parejasPorZona4 = 4

    // Número ideal de zonas de 3
    let zonasDe3 = Math.min(Math.floor(parejas / parejasPorZona3), maxZonas)
    let parejasUsadas = zonasDe3 * 3
    let parejasRestantes = parejas - parejasUsadas

    // Si hay restantes, intentamos convertirlos en zonas de 4
    let zonasDe4 = 0
    while (parejasRestantes > 0 && zonasDe3 > 0) {
        zonasDe3--
        zonasDe4++
        parejasRestantes--
    }

    // Ajustar a no más de 16 zonas
    const totalZonas = zonasDe3 + zonasDe4

    if (totalZonas > maxZonas) {
        throw new Error('No es posible organizar las parejas en un máximo de 16 zonas.')
    }

    return {
        zonasDe3,
        zonasDe4,
        totalZonas
    }
}

function orderCouples(parejas) {
    return parejas.sort((a, b) => b.puntos_totales - a.puntos_totales)
}

function searchTopCouples(parejas, totalZonas) {
    return parejas.slice(0, totalZonas)
}

function searchSecondCouples(parejas, totalZonas) {
    return parejas.slice(totalZonas, totalZonas * 2)
}

function searchThirdCouples(parejas, totalZonas) {
    return parejas.slice(totalZonas * 2, totalZonas * 3)
}

function searchFourthCouples(parejas, totalZonas, zonasDe4) {
    return parejas.slice(totalZonas * 3, totalZonas * 3 + zonasDe4)
}

async function generarZonas(parejas) {
    const zonas = []
    const zonasPermitidas = 'ABCDEFGHIJKLMNOP'.split('')

    const { zonasDe3, zonasDe4, totalZonas } = calcularZonas(parejas.length)

    // Ordenar parejas de mayor a menor
    orderCouples(parejas)

    // Separo las parejas cabeza de serie
    const cabezaDeSerie = searchTopCouples(parejas, totalZonas)
    const segundasParejas = searchSecondCouples(parejas, totalZonas)
    const tercerasParejas = searchThirdCouples(parejas, totalZonas)

    let cuartasParejas = []
    if (zonasDe4 > 0) {
        cuartasParejas = searchFourthCouples(parejas, totalZonas, zonasDe4)
    }

    // Ordenar segundas, terceras y cuartas parejas para cumplir con las reglas
    // Segundas parejas: de menor a mayor (la peor enfrenta a la cabeza de serie)
    segundasParejas.sort((a, b) => a.puntos_totales - b.puntos_totales)

    // Terceras parejas: de mayor a menor (la mejor va a la zona A)
    tercerasParejas.sort((a, b) => b.puntos_totales - a.puntos_totales)

    // Cuartas parejas: de menor a mayor (la peor va a la zona A)
    // valido que se > 48 porque cuando hay mas la zona de 4 va al ultimo grupo la mejor va al ultimo grupo
    if (zonasDe4 > 0 && parejas.length > 48) {
        cuartasParejas.sort((a, b) => a.puntos_totales - b.puntos_totales)
    }

    // Genero todas las zonas
    for (let i = 0; i < totalZonas; i++) {
        const zona = {
            nombre: zonasPermitidas[i],
            parejas: [
                cabezaDeSerie[i], // Cabeza de serie
                segundasParejas[i], // Segunda pareja (la peor enfrenta a la cabeza de serie)
                tercerasParejas[i] // Tercera pareja (la mejor va a la zona A)
            ],
            partidos: []
        }

        // Si hay una cuarta pareja para esta zona, la agregamos.
        // valido que sea < 49 porque si hay 49 la zona de 4 es a partir de la ultima zona.
        if (i < zonasDe4 && parejas.length < 49) {
            zona.parejas.push(cuartasParejas[i]) // Cuarta pareja (la peor va a la zona A)
        }

        zonas.push(zona)
    }

    if (parejas.length > 48) {
        let numeroDeZonas = 15
        for (let i = 0; i < cuartasParejas.length; i++) {
            zonas[numeroDeZonas].parejas.push(cuartasParejas[i])
            numeroDeZonas--
        }
    }
    return zonas
}

//! SIN MODIFICACIONES
// async function generarZonas(parejas) {
//     const zonas = []
//     const zonasPermitidas = 'ABCDEFGHIJKLMNOP'.split('')

//     const { zonasDe3, zonasDe4, totalZonas } = calcularZonas(parejas.length)

//     orderCouples(parejas)
//     // Separo las parejas cabeza de serie
//     const cabezaDeSerie = searchTopCouples(parejas, totalZonas)
//     const segundasParejas = searchSecondCouples(parejas, totalZonas)
//     const tercerasParejas = searchThirdCouples(parejas, totalZonas)

//     let cuartasParejas = []
//     if (zonasDe4 > 0) {
//         cuartasParejas = searchFourthCouples(parejas, totalZonas, zonasDe4)
//     }

//     // Genero todas las zonas
//     for (let i = 0; i < totalZonas; i++) {
//         const segundaPareja = segundasParejas.length - 1 - i

//         const zona = {
//             nombre: zonasPermitidas[i],
//             parejas: [cabezaDeSerie[i], segundasParejas[segundaPareja], tercerasParejas[i]],
//             partidos: []
//         }

//         // Si hay una cuarta pareja para esta zona, la agregamos
//         if (i < zonasDe4) {
//             zona.parejas.push(cuartasParejas[i])
//         }

//         zonas.push(zona)
//     }

//     console.log(JSON.stringify(zonas, null, 2))
//     return zonas
// }

// Generar enfrentamientos entre cada pareja en la zona
function generateMatches(zone) {
    const matches = []
    for (let i = 0; i < zone.parejas.length; i++) {
        for (let j = i + 1; j < zone.parejas.length; j++) {
            matches.push({
                pareja1: zone.parejas[i],
                pareja2: zone.parejas[j]
            })
        }
    }
    return matches
}

export const generateByCategory = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }

        const { id_tournament, id_category, gender } = req.body
        const inscriptions = await CouplesModel.searchCouplesByTournamentAndCategory(id_tournament, id_category, gender)
        const zones = await generarZonas(inscriptions)
        return res.status(200).json({ count: inscriptions.length, zones: zones, couples: inscriptions })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//console.log(JSON.stringify(zonas, null, 2))
