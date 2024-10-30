import mysql from "mysql2/promise"
import {
    ENVAIROMENT,
    DB_HOST,
    DB_PASS,
    DB_PORT,
    DB_SCHEMA,
    DB_USER,
} from "./app.config.js"

const config = {
    host: ENVAIROMENT === "produccion" ? DB_HOST : "localhost",
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_SCHEMA,
}

const connection = await mysql.createConnection(config)

export { connection }
