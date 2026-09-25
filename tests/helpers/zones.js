/**
 * Parejas con id 1..cantidad, ya ordenadas de mayor a menor puntaje,
 * que es como las espera generarZonas cuando no vienen rankeadas.
 */
export const crearParejas = (cantidad) => Array.from({ length: cantidad }, (_, i) => ({
    id: i + 1,
    puntos_totales: (cantidad - i) * 10
}))

/**
 * Devuelve solo los ids, para comparar el orden de las parejas
 * sin tener que escribir los objetos completos en el esperado.
 */
export const ids = (parejas) => parejas.map(pareja => pareja.id)

/**
 * Resume las zonas que devuelve generarZonas como { A: [ids], B: [ids], ... },
 * respetando el orden de las parejas dentro de cada zona.
 */
export const idsPorZona = (zonas) => Object.fromEntries(zonas.map(zona => [zona.nombre, ids(zona.parejas)]))

/**
 * Todos los ids de todas las zonas en una sola lista ordenada de menor a mayor.
 * Sirve para verificar que cada pareja aparece una sola vez.
 */
export const idsEnZonas = (zonas) => zonas.flatMap(zona => ids(zona.parejas)).sort((a, b) => a - b)
