import jwt from "jsonwebtoken"
process.loadEnvFile()

export const validateToken = (req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
        const data = jwt.verify(token, process.env.SECRET_JWT_KEY)
        req.session.user = data
    } catch (error) {}

    next()
}
