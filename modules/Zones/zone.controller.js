import { hasRole, isAdmin } from '../../middlewares/permisions.js'
import { CouplesModel } from '../Couples/couples.model.js'
import { ZonesModel } from './zone.model.js'
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
    if (parejas[0]?.ranked === 1) {
        orderCouples(parejas)
    }
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

async function ordenarZonasGeneradas(generateds, inscriptions) {
    const zones = {}
    for (let i = 0; i < generateds.length; i++) {
        const zone = generateds[i].zone
        if (!zones[zone]) {
            zones[zone] = {
                nombre: zone,
                club: generateds[i].id_club,
                hour: generateds[i].hour,
                day: generateds[i].day,
                idMain: generateds[i].id,
                parejas: [],
                partidos: []
            }
        }
        const couple1 = inscriptions.find(
            (couple) => couple.id_couple === generateds[i].id_couple1 && generateds[i].match === 1
        )
        const couple2 = inscriptions.find(
            (couple) => couple.id_couple === generateds[i].id_couple1 && generateds[i].match === 2
        )
        const couple3 = inscriptions.find(
            (couple) => couple.id_couple === generateds[i].id_couple2 && generateds[i].match === 2
        )
        const couple4 = inscriptions.find(
            (couple) => couple.id_couple === generateds[i].id_couple2 && generateds[i].match === 1
        )
        if (couple1) {
            zones[zone].parejas[0] = couple1
        }
        if (couple2) {
            zones[zone].parejas[1] = couple2
        }
        if (couple3) {
            zones[zone].parejas[3] = zones[zone].parejas[2]
            zones[zone].parejas[2] = couple3
        }
        if (couple4) {
            zones[zone].parejas[2] = couple4
        }
    }
    return Object.values(zones)
}

export const generateByCategory = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }

        const { id_tournament, id_category, gender } = req.body
        const inscriptions = await CouplesModel.searchCouplesByTournamentAndCategory(id_tournament, id_category, gender)
        const generateds = await ZonesModel.searchGeneratedZones(id_tournament, id_category)
        const zones =
            generateds.length > 0
                ? await ordenarZonasGeneradas(generateds, inscriptions)
                : await generarZonas(inscriptions)
        return res.status(200).json({ count: inscriptions.length, zones: zones, couples: inscriptions })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getZones = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!user) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }
        const { tournament, category } = req.query
        const zones = await ZonesModel.getZones(tournament, category)
        return res.status(200).json(zones)
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const saveZones = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' })
        }
        const data = req.body
        await ZonesModel.saveZones(data)
        return res.status(200).json({ message: 'Zonas guardadas correctamente' })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

function calcularEstadisticasOrdenadas(matches) {
    const statsByCouple = {};

    function initCoupleStats(id) {
        if (!statsByCouple[id]) {
            statsByCouple[id] = {
                id: id,
                partidos: 0,
                ganados: 0,
                perdidos: 0,
                wo: 0,
                puntos: 0,
                setsGanados: 0,
                setsPerdidos: 0,
                gamesAFavor: 0,
                gamesEnContra: 0,
                diferenciaGames: 0
            };
        }
    }

    for (const match of matches) {
        const {
            id_couple1,
            id_couple2,
            first_set_couple1,
            first_set_couple2,
            second_set_couple1,
            second_set_couple2,
            third_set_couple1,
            third_set_couple2,
            winner_couple,
            wo
        } = match;

        initCoupleStats(id_couple1);
        initCoupleStats(id_couple2);

        statsByCouple[id_couple1].partidos += 1;
        statsByCouple[id_couple2].partidos += 1;

        const loser = winner_couple === id_couple1 ? id_couple2 : id_couple1;

        if (wo) {
            statsByCouple[loser].wo += 1;
        }

        statsByCouple[winner_couple].ganados += 1;
        statsByCouple[loser].perdidos += 1;

        statsByCouple[winner_couple].puntos += 2;
        statsByCouple[loser].puntos += wo ? 0 : 1;

        const sets = [
            [first_set_couple1, first_set_couple2],
            [second_set_couple1, second_set_couple2],
            [third_set_couple1, third_set_couple2],
        ];

        for (const [set1, set2] of sets) {
            if (set1 !== null && set2 !== null) {
                if (set1 > set2) {
                    statsByCouple[id_couple1].setsGanados += 1;
                    statsByCouple[id_couple2].setsPerdidos += 1;
                } else {
                    statsByCouple[id_couple2].setsGanados += 1;
                    statsByCouple[id_couple1].setsPerdidos += 1;
                }

                statsByCouple[id_couple1].gamesAFavor += set1;
                statsByCouple[id_couple1].gamesEnContra += set2;

                statsByCouple[id_couple2].gamesAFavor += set2;
                statsByCouple[id_couple2].gamesEnContra += set1;
            }
        }
    }

    // Calculamos diferencia de games
    const result = Object.values(statsByCouple).map(stats => {
        stats.diferenciaGames = stats.gamesAFavor - stats.gamesEnContra;
        return stats;
    });

    // Ordenamos de mejor a peor
    result.sort((a, b) => {
        return (
            b.puntos - a.puntos ||
            b.diferenciaGames - a.diferenciaGames ||
            b.setsGanados - a.setsGanados ||
            b.gamesAFavor - a.gamesAFavor
        );
    });

    return result;
}



export const endZone = async (req, res) => {
  try {
    const { user } = req.session;
    if (!hasRole(user, ['admin', 'largador', 'superAdmin'])) {
      return res.status(403).json({ message: 'No tiene permisos para acceder a este recurso' });
    }

    const { id_matchs } = req.body;
    if (!id_matchs) {
      return res.status(400).json({ message: 'Faltan parámetros obligatorios' });
    }

    const matchs = await ZonesModel.getMatchsByZone(id_matchs);
    if (matchs.length === 0) {
      return res.status(400).json({ message: 'No se encontraron partidos' });
    }

    // Mapear nombres por pareja
    const coupleNamesMap = {};
    for (const match of matchs) {
      if (!coupleNamesMap[match.id_couple1]) {
        coupleNamesMap[match.id_couple1] = match.pareja1;
      }
      if (!coupleNamesMap[match.id_couple2]) {
        coupleNamesMap[match.id_couple2] = match.pareja2;
      }
    }

    const estadisticas = calcularEstadisticasOrdenadas(matchs).map(stat => ({
      ...stat,
      nombre: coupleNamesMap[stat.id] || 'SIN NOMBRE'
    }));

    return res.status(200).json({ estadisticas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

