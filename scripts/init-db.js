const fs = require('fs')
const path = require('path')
const { sequelize } = require('../src/shared/database') // Usa tu conexión a la DB

const runSQLFile = async (filePath) => {
    const query = fs.readFileSync(filePath, 'utf-8')
    try {
        await sequelize.query(query)
        console.log(`Successfully ran ${filePath}`)
    } catch (error) {
        console.error(`Error running ${filePath}:`, error)
    }
}

const runMigrations = async () => {
    const migrationsDir = path.join(__dirname, '../src/db/migrations')
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
