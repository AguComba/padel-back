import fs from 'fs'
import { connection } from '../config/db.config.js'
import bcrypt from 'bcrypt'
import path from 'path'
const __dirname = path.resolve()

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

const runCategoriesSeeder = async (filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(rawData)

    try {
        await connection.connect()

        if (!Array.isArray(data.categories)) {
            throw new TypeError('data.categories is not an array')
        }

        // Iterar sobre las categorías y realizar las inserciones
        for (const category of data.categories) {
            const { name, status } = category
            const sql = 'INSERT INTO categories (name, status, created_at) VALUES (?, ?, NOW())'
            const values = [name, status]

            await connection.query(sql, values)
            console.log(`Categoría ${name} insertada`)
        }
    } catch (error) {
        console.error('Error inserting categories:', error)
    }
}

const runLocationsSeeder = async (filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(rawData)

    try {
        await connection.connect()

        if (!Array.isArray(data.locations)) {
            throw new TypeError('data.locations is not an array')
        }

        // Iterar sobre las localidades y realizar las inserciones
        for (const location of data.locations) {
            const { name, zip_code, id_province, status } = location
            const sql =
                'INSERT INTO cities (name, zip_code, id_province, status, created_at) VALUES (?, ?, ?, ?, NOW())'
            const values = [name, zip_code, id_province, status]

            await connection.query(sql, values)
            console.log(`Localidad ${name} insertada`)
        }
    } catch (error) {
        console.error('Error reading locations file:', error)
        return { error: 'Error reading locations file' }
    }
}

const runUsersSeeder = async (filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(rawData)

    try {
        await connection.connect()

        if (!Array.isArray(data.users)) {
            throw new TypeError('data.users is not an array')
        }

        // Iterar sobre los usuarios y realizar las inserciones
        for (const user of data.users) {
            const {
                name,
                last_name,
                cell_phone,
                email,
                type_document,
                number_document,
                gender,
                id_city,
                password,
                status,
                type_user
            } = user
            // Hasheo de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10)
            const sql =
                'INSERT INTO users (name, last_name, cell_phone, email, type_document, number_document, gender, id_city, password, status, type_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            const values = [
                name,
                last_name,
                cell_phone,
                email,
                type_document,
                number_document,
                gender,
                id_city,
                hashedPassword,
                status,
                type_user
            ]
            await connection.query(sql, values)
            console.log(`Usuario ${email} insertado`)
        }
    } catch (error) {
        console.error('Error reading users file:', error)
        return { error: 'Error reading users file' }
    }
}

const runSeeders = async () => {
    const seederFile = `${__dirname}/json/provincias.json`
    await runProvincesSeeder(seederFile)

    const locationsSeederFile = `${__dirname}/json/localidades.json`
    await runLocationsSeeder(locationsSeederFile)

    const userTypesSeederFile = `${__dirname}/json/userTypes.json`
    await runUserTypesSeeder(userTypesSeederFile)

    const categoriesSeederFile = `${__dirname}/json/categories.json`
    await runCategoriesSeeder(categoriesSeederFile)

    const userSeederFile = `${__dirname}/json/users.json`
    await runUsersSeeder(userSeederFile)

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
