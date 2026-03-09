import { getPool } from '../config/db.config.js'
/**
 * Maneja una transacción de manera genérica.
 * @param {Function} callback - La función que contiene la lógica de negocio. Recibe como argumento la conexión activa de la transacción.
 * @returns {Promise<any>} - Retorna el resultado de la operación dentro de la transacción.
 * @throws {Error} - Propaga errores ocurridos dentro de la transacción.
 */
export const handleTransaction = async (callback) => {
  let connection 
  try {
    const pool = await getPool()
    const connection = await pool.getConnection() // Obtén una conexión del pool.

    await connection.beginTransaction() // Inicia la transacción.

    const result = await callback(connection) // Ejecuta la lógica de negocio con la conexión.

    await connection.commit() // Confirma la transacción.
    return result // Devuelve el resultado del callback.
  } catch (error) {
    await connection.rollback() // Revierte la transacción en caso de error.
    throw error // Propaga el error.
  } finally {
    if (connection) connection.release() // Libera la conexión al pool.
  }
}
