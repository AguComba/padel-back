import fs from 'fs'
import path from 'path'
import { executeQuery } from '../utils/executeQuery.js'
const __dirname = path.resolve()

const runSQLFile = async (filePath) => {
    const query = fs.readFileSync(filePath, 'utf-8')
    try {
        await executeQuery(query)
    } catch (error) {
        console.error(`Error running ${filePath}:`, error)
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

runMigrations()
    .then(() => {
        console.log('All migrations have been run')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Error running migrations:', error)
        process.exit(1)
    })
