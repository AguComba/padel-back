import {beforeAll, afterAll, beforeEach} from "vitest"
import {startMySql, stopMySql} from "./integration/mysql-container.js"
import {createTestDbPool, resetDatabase, runMigrations} from "./integration/db-utils.js";

let pool

beforeAll(async () => {
    const db = await startMySql();

    process.env.DB_HOST = db.host;
    process.env.DB_PORT = String(db.port);
    process.env.DB_USER = db.user;
    process.env.DB_PASS = db.password;
    process.env.DB_SCHEMA = db.database;
    process.env.NODE_ENV = "test";

    pool = await createTestDbPool()
    await runMigrations(pool)
}, 120000);

beforeEach(async () => {
    await resetDatabase(pool)
})

afterAll(async () => {
    if (pool) await pool.end()
    await stopMySql();
}, 120000);