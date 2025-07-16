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
import { playersRouter } from './modules/Player/player.routes.js'
import { rankingRouter } from './modules/Ranking/ranking.routes.js'
import { tournamentRouter } from './modules/Tournaments/tournament.routes.js'
import { inscriptionsRouter } from './modules/Inscriptions/inscriptions.routes.js'
import { userRoutes } from './modules/Users/user.routes.js'
import { paymentRouter } from './modules/Payment/payment.routes.js'
import { zonesRouter } from './modules/Zones/zone.routes.js'
// MATCH ROUTER
import ResultMatchRepositoryMysql from './modules/Results/Infrastructure/ResultMatchRepositoryMysql.js'
import createResultMatchRoutes from './modules/Results/Infrastructure/ResultMatchRoutes.js'
import RegisterResultMatch from './modules/Results/Application/RegisterResultMatch.js'

// INYECCION DE DEPENDENCIAS
const resultMatchRepository = new ResultMatchRepositoryMysql()
const registerResultMatchUseCase = new RegisterResultMatch(resultMatchRepository)


const app = express()

app.use(corsMiddleware())
app.disable('x-powered-by')
app.use(json())
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/payments', paymentRouter)

// De aca para abajo, todas las rutas necesitan un token valido
app.use('/provinces', provincesRoutes)
app.use('/cities', citiesRoutes)
app.use('/federations', federationsRoutes)
app.use('/clubs', clubsRoutes)
app.use('/categories', categoriesRoutes)
app.use('/players', playersRouter)
app.use('/ranking', rankingRouter)
app.use('/tournaments', tournamentRouter)
app.use('/inscriptions', inscriptionsRouter)
app.use('/users', userRoutes)
app.use('/zones', zonesRouter)
app.use('/result-match', createResultMatchRoutes(registerResultMatchUseCase))
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' }) 
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
