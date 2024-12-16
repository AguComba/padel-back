import fs from 'fs'
import { connection } from '../config/db.config.js'

const runProvincesSeeder = async (filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(rawData)

  try {
    await connection.connect()

    // Iterar sobre las provincias y realizar las inserciones
    for (const provincia of data.provincias) {
      const nombre = provincia.nombre
      const sql = 'INSERT INTO provinces (name, status, created_at) VALUES (?, ?, NOW())'
      const values = [nombre, 1]

      await connection.query(sql, values)
      console.log(`Provincia ${nombre} insertada`)
    }

    console.log(`Successfully ran ${filePath}`)
  } catch (error) {
    console.error(`Error running ${filePath}:`, error)
  }
}

const runUserTypesSeeder = async (filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(rawData)

  try {
    await connection.connect()

    // Iterar sobre los tipos de usuarios y realizar las inserciones
    for (const userType of data.user_types) {
      const { name, description, status } = userType
      const sql = 'INSERT INTO type_users (name, description, status, created_at) VALUES (?, ?, ?, NOW())'
      const values = [name, description, status]

      await connection.query(sql, values)
      console.log(`Tipo de usuario ${name} insertado`)
    }
  } catch (error) {
    console.error('Error inserting user types:', error)
  }
}

const runSeeders = async () => {
  const seederFile = 'C:/Users/agust/padel-back/json/provincias.json'
  await runProvincesSeeder(seederFile)

  const userTypesSeederFile = 'C:/Users/agust/padel-back/json/userTypes.json'
  await runUserTypesSeeder(userTypesSeederFile)

  await connection.end()
}

runSeeders()
  .then(() => {
    console.log('All seeders have been run')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error running seeders:', error)
    process.exit(1)
  })
