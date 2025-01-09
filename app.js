import express, { json } from 'express'
import { PORT } from './config/app.config.js'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middlewares/cors.js'
import { authRoutes } from './modules/Auth/auth.routes.js'
import { citiesRoutes } from './modules/Cities/cities.routes.js'
import { provincesRoutes } from './modules/Provinces/povinces.routes.js'
import { federationsRoutes } from './modules/Federations/federations.routes.js'
import { clubsRoutes } from './modules/Club/club.routes.js'
import { categoriesRoutes } from './modules/Categories/categories.routes.js'
process.loadEnvFile()

const app = express()

app.use(corsMiddleware())
app.disable('x-powered-by')
app.use(json())
app.use(cookieParser())

app.use('/auth', authRoutes)

// De aca para abajo, todas las rutas necesitan un token valido
app.use('/provinces', provincesRoutes)
app.use('/cities', citiesRoutes)
app.use('/federations', federationsRoutes)
app.use('/clubs', clubsRoutes)
app.use('/categories', categoriesRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
