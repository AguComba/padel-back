import jwt from 'jsonwebtoken'

/**
 * Valores de typeUser segun middlewares/permisions.js
 */
export const ROLES = {
    player: 1,
    admin: 2,
    fiscal: 3,
    largador: 4,
    superAdmin: 5
}

/**
 * Construye el objeto de usuario que el login mete adentro del JWT
 * (ver buildUserLoginResponse en modules/Auth/auth.controller.js).
 */
export const buildUser = ({ id = 1, role = 'admin', email = 'test@test.com', gender = 'M' } = {}) => ({
    id,
    email,
    typeUser: ROLES[role],
    name: 'TEST',
    last_name: 'USER',
    gender
})

/**
 * Firma un token con la misma clave que usa la app.
 * vitest.config.js setea SECRET_JWT_KEY antes de importar config/app.config.js.
 */
export const signToken = (user) => jwt.sign(user, process.env.SECRET_JWT_KEY, { expiresIn: '4h' })

/**
 * Devuelve el header Cookie listo para usar con supertest:
 *   request(app).get('/zones').set('Cookie', authCookie({ role: 'admin' }))
 */
export const authCookie = (options = {}) => [`access_token=${signToken(buildUser(options))}`]
