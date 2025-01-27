import { pool } from '../config/db.config.js'

/**
 * Función genérica para ejecutar consultas con el pool de conexiones
 * @param {string} query - La consulta SQL a ejecutar
 * @param {Array} params - Los parámetros para la consulta (opcional)
 * @returns {Promise<any>} - El resultado de la consulta
 */
export const executeQuery = async (query, params = []) => {
    let connection
    try {
        connection = await pool.getConnection() // Obtener conexión del pool
        const [results] = await connection.query(query, params)
        return results
    } catch (error) {
        throw new Error('Database query error: ' + error.message)
    } finally {
        if (connection) connection.release() // Asegura que la conexión siempre se libere
    }
}
