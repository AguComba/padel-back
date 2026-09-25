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
