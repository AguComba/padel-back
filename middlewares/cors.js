import cors from 'cors'
const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:8081',
    'https://padel-front-production.up.railway.app/',
    'https://apcpadel.com.ar/'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
    cors({
        origin: (origin, callback) => {
            if (acceptedOrigins.includes(origin)) {
                return callback(null, true)
            }

            if (!origin) {
                return callback(null, true)
            }

            return callback(new Error('Not allowed by CORS'))
        },
        credentials: true
    })
