// Solo cargar .env si NO estamos en test
if (process.env.NODE_ENV !== 'test') {
  try {
    process.loadEnvFile()
    console.log('.env cargado correctamente.')
  } catch (err) {
    console.log('Archivo .env no encontrado o no es necesario. Usando variables del entorno.')
  }
}

export const {
  PORT,
  ENVAIROMENT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_SCHEMA,
  SECRET_JWT_KEY,
  FRONT_URL,
  MACRO_SECRET,
  MACRO_COMMERCE_ID,
  MACRO_FRASE
} = process.env

if (process.env.NODE_ENV !== 'test') {
  console.log(PORT, ENVAIROMENT, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_SCHEMA, SECRET_JWT_KEY)
}