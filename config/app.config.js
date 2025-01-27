try {
    // Intentar cargar variables desde un archivo .env, solo en desarrollo
    process.loadEnvFile()
    console.log('.env cargado correctamente.')
} catch (err) {
    console.log('Archivo .env no encontrado o no es necesario. Usando variables del entorno.')
}

export const { PORT, ENVAIROMENT, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_SCHEMA, SECRET_JWT_KEY } = process.env
console.log(PORT, ENVAIROMENT, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_SCHEMA, SECRET_JWT_KEY)
