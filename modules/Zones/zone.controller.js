import { parejas, parejas4, parejasSuma6 } from './couples.js'

function calcularZonas(parejas) {
  if (parejas > 64) {
    return 'No es posible organizar más de 64 parejas.'
  }

  const maxZonas = 16
  const parejasPorZona3 = 3
  const parejasPorZona4 = 4

  // Número ideal de zonas de 3
  // Redondeo hacia abajo para no exceder el número de parejas
  let zonasDe3 = Math.floor(parejas / parejasPorZona3)
  let restantes = parejas % parejasPorZona3

  // Ajustar a no más de 16 zonas
  if (zonasDe3 > maxZonas) {
    zonasDe3 = maxZonas
    restantes = parejas - zonasDe3 * parejasPorZona3
  }

  // Ajustar zonas de 4 si hay parejas restantes
  let zonasDe4 = 0
  if (restantes > 0) {
    zonasDe4 = Math.ceil(restantes / (parejasPorZona4 - parejasPorZona3))
    zonasDe3 -= zonasDe4 // Convertimos algunas zonas de 3 a 4
  }

  // Validación para que no exceda el máximo de 16 zonas
  const totalZonas = zonasDe3 + zonasDe4
  if (totalZonas > maxZonas) {
    return 'No es posible organizar las parejas en un máximo de 16 zonas.'
  }

  return {
    zonasDe3,
    zonasDe4,
    totalZonas,
  }
}

function isValidNumberOfCouples(cabezaDeSerie, segundasParejas, tercerasParejas, totalZonas) {
  console.log(cabezaDeSerie.length, segundasParejas.length, tercerasParejas.length, totalZonas)
  return cabezaDeSerie.length + segundasParejas.length + tercerasParejas.length === totalZonas
}

function orderCouples(parejas) {
  return parejas.sort((a, b) => b.puntos - a.puntos)
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
  return parejas.slice(totalZonas * 3, totalZonas + zonasDe4)
}

function generarZonas(parejas) {
  const zonas = []
  const zonasPermitidas = 'ABCDEFGHIJKLMNOP'.split('')

  const { zonasDe3, zonasDe4, totalZonas } = calcularZonas(parejas.length)

  orderCouples(parejas)
  // Separo las parejas cabeza de serie
  const cabezaDeSerie = searchTopCouples(parejas, totalZonas)
  const segundasParejas = searchSecondCouples(parejas, totalZonas)
  const tercerasParejas = searchThirdCouples(parejas, totalZonas)

  let cuartasParejas
  if (zonasDe4 > 0) {
    cuartasParejas = searchFourthCouples(parejas, totalZonas, zonasDe4)
  }

  // Genero todas las zonas
  // Las zonas se forman de arriba abajo, la primera de la cabeza de serie a la primer zona contra la ultima de las segundas parejas
  for (let i = 0; i < totalZonas; i++) {
    const segundaPareja = segundasParejas.length - 1 - i

    const zona = {
      nombre: zonasPermitidas[i],
      parejas: [cabezaDeSerie[i], segundasParejas[segundaPareja], tercerasParejas[i]],
      partidos: [],
    }

    zonas.push(zona)
  }

  console.log(JSON.stringify(zonas, null, 2))
  return zonas
}

// Generar enfrentamientos entre cada pareja en la zona
function generateMatches(zone) {
  const matches = []
  for (let i = 0; i < zone.parejas.length; i++) {
    for (let j = i + 1; j < zone.parejas.length; j++) {
      matches.push({
        pareja1: zone.parejas[i],
        pareja2: zone.parejas[j],
      })
    }
  }
  return matches
}

generarZonas(parejas4)
//console.log(JSON.stringify(zonas, null, 2))
