import express, { json } from "express"
import { PORT } from "./config/app.config.js"
import cookieParser from "cookie-parser"
import { corsMiddleware } from "./middlewares/cors.js"
// import dotenv from 'dotenv'
import { authRoutes } from "./modules/Auth/auth.routes.js"
import { validateToken } from "./middlewares/validateToken.js"
// Uso de dotenv para cargar las variables de entorno
process.loadEnvFile()
// dotenv.config()

const app = express()

app.use(corsMiddleware())
app.disable("x-powered-by")
app.use(json())
app.use(cookieParser())
app.use(validateToken)

app.use("/auth", authRoutes)
app.get("/protected", (req, res) => {
    if (!req.session.user) {
        return res.status(401).send("Unauthorized")
    }
    const { username, id, role } = req.session.user
    res.send({ username, id, role })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})
