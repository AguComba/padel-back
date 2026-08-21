import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    // Estas variables se setean ANTES de que se importe config/app.config.js,
    // asi los tests nunca dependen del .env real ni de la base de datos.
    env: {
      NODE_ENV: 'test',
      SECRET_JWT_KEY: 'test-secret-key',
      MACRO_SECRET: 'test-macro-secret',
      MACRO_COMMERCE_ID: '1234',
      MACRO_FRASE: 'test-frase',
      SAMESITE: 'lax',
      PORT: '3000',
      DB_HOST: 'localhost',
      DB_PORT: '3307',
      DB_USER: 'test',
      DB_PASS: 'test',
      DB_SCHEMA: 'padel_test'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['modules/**', 'middlewares/**', 'schemas/**', 'utils/**']
    }
  }
})
