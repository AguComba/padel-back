import fs from "node:fs/promises"
import path from "node:path"
import mysql from "mysql2/promise"

export async function createTestDbPool() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    connectionLimit: 10,
    multipleStatements: true
  })

  await pool.query("SELECT 1")
  return pool
}

export async function runMigrations(pool) {
  console.log("Running migrations...");
  const migrationsDir = path.resolve(process.cwd(), "db/migrations")
  const allFiles = await fs.readdir(migrationsDir)

  const files = allFiles
    .filter((file) => file.endsWith(".sql"))
    .sort()


  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    console.log(`Running migration ${file}`)

    const sql = await fs.readFile(filePath, "utf8")
    await pool.query(sql)
  }
  console.log("Migrations completed.");
}

export async function resetDatabase(pool) {
  console.log("Resetting database...");
  const [rows] = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = ?
      AND table_type = 'BASE TABLE'
  `, [process.env.DB_SCHEMA])

  const tables = rows.map(r => r.TABLE_NAME || r.table_name)

  if (!tables.length) return

  await pool.query("SET FOREIGN_KEY_CHECKS = 0")

  for (const table of tables) {
    await pool.query(`TRUNCATE TABLE \`${table}\``)
  }

  await pool.query("SET FOREIGN_KEY_CHECKS = 1")
  console.log("Database reset completed.");
}