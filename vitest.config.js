import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['**/*.js'],
            exclude: [
                'utils/**',
                'tests/**',
                'coverage/**',
                'node_modules/**',
                'scripts/**'
            ],
        },
        setupFiles: './tests/setup.js',
        include: ["tests/**/*.test.js"],
        testTimeout: 30000,
        hookTimeout: 120000
    }
})