import express, { json } from 'express'
import { PORT } from './config/app.config.js'
import cookieParser from 'cookie-parser'
import { corsMiddleware } from './middlewares/cors.js'
import { authRoutes } from './modules/Auth/auth.routes.js'
import { validateToken } from './middlewares/validateToken.js'
process.loadEnvFile()

const app = express()

app.use(corsMiddleware())
app.disable('x-powered-by')
app.use(json())
app.use(cookieParser())
app.use(validateToken)

app.use('/auth', authRoutes)
app.get('/protected', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Unauthorized')
  }
  const { id, email, typeUser } = req.session.user
  res.send({ id, email, typeUser })
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`)
})
