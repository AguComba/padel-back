import fs from 'fs'
import path from 'path'
import { executeQuery } from '../utils/executeQuery.js'

const __dirname = path.resolve()

// Crear la base de datos si no existe
const createDatabaseIfNotExists = async (databaseName) => {
    try {
        await executeQuery(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`)
        console.log(`Base de datos '${databaseName}' verificada.`)
    } catch (error) {
        console.error(`Error verificando la base de datos:`, error)
        process.exit(1)
    }
}

const runSQLFile = async (filePath) => {
    const query = fs.readFileSync(filePath, 'utf-8')
    try {
        await executeQuery(query)
    } catch (error) {
        console.error(`Error ejecutando ${filePath}:`, error)
    }
}

const runMigrations = async () => {
    const migrationsDir = `${__dirname}/db/migrations`
    const files = fs.readdirSync(migrationsDir)
    for (const file of files) {
        const filePath = path.join(migrationsDir, file)
        await runSQLFile(filePath)
    }
}

const main = async () => {
    const databaseName = 'padel' // Cambia esto según tu configuración
    await createDatabaseIfNotExists(databaseName)
    await runMigrations()
    console.log('Todas las migraciones han sido ejecutadas.')
    process.exit(0)
}

main().catch((error) => {
    console.error('Error ejecutando migraciones:', error)
    process.exit(1)
})
