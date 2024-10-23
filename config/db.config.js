import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'tickeala',
    database: 'padelDB'
}

const connection = await mysql.createConnection(config)

export { connection }
