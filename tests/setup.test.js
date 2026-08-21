import { describe, it, expect } from 'vitest'

/**
 * Smoke test del entorno de testing.
 * Verifica que vitest.config.js este cargando las variables de entorno
 * ANTES de que cualquier modulo lea process.env. Si esto falla, todos
 * los tests que dependan de config/app.config.js van a fallar raro.
 */
describe('setup del entorno de tests', () => {
    it('carga las variables de entorno definidas en vitest.config.js', () => {
        expect(process.env.SECRET_JWT_KEY).toBe('test-secret-key')
        expect(process.env.MACRO_SECRET).toBe('test-macro-secret')
    })

    it('importar config/app.config.js toma las variables del entorno de test', async() => {
        const { SECRET_JWT_KEY, DB_SCHEMA } = await import('../config/app.config.js')
        expect(SECRET_JWT_KEY).toBe('test-secret-key')
        expect(DB_SCHEMA).toBe('padel_test')
    })

    it('importar el pool de mysql no abre ninguna conexion', async() => {
    // mysql.createPool() es lazy: no conecta hasta el primer getConnection().
    // Gracias a esto podemos importar cualquier modelo sin levantar MySQL.
        const { pool } = await import('../config/db.config.js')
        expect(pool).toBeDefined()
    })
})
