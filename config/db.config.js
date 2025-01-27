import mysql from 'mysql2/promise'
import { ENVAIROMENT, DB_HOST, DB_PASS, DB_PORT, DB_SCHEMA, DB_USER } from './app.config.js'

const config = {
    host: ENVAIROMENT === 'produccion' ? DB_HOST : 'localhost',
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_SCHEMA
}

let pool
try {
    pool = mysql.createPool(config) // Crea un pool de conexiones
    console.log('Conexión a la base de datos establecida')
} catch (error) {
    console.error('Error al conectar con la base de datos', error)
}

export { pool }
