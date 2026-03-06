import mysql from 'mysql2/promise'

let pool

export const getPool = async () => {
  if (pool) return pool

  const config = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA
  }

  pool = mysql.createPool({
    ...config,
    connectionLimit: 10
  })

  await pool.query('SELECT 1')
  console.log('Conexión a la base de datos establecida')

  return pool
}

export const closePool = async () => {
  if (!pool) return
  await pool.end()
  pool = null
}
