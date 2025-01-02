import express, { json } from 'express'
import { PORT } from './config/app.config.js'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middlewares/cors.js'
import { authRoutes } from './modules/Auth/auth.routes.js'
import { validateToken } from './middlewares/validateToken.js'
import { citiesRoutes } from './modules/Cities/cities.routes.js'
process.loadEnvFile()

const app = express()

app.use(corsMiddleware())
app.disable('x-powered-by')
app.use(json())
app.use(cookieParser())

app.use('/auth', authRoutes)

// De aca para abajo, todas las rutas necesitan un token valido
app.use(validateToken)
app.use('/cities', citiesRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
