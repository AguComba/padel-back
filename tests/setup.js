import { beforeAll, afterAll } from "vitest"
import { startMySql, stopMySql  } from "./integration/mysql-container.js"

beforeAll(async () => {
  const db = await startMySql();

  process.env.DB_HOST = db.host;
  process.env.DB_PORT = String(db.port);
  process.env.DB_USER = db.user;
  process.env.DB_PASSWORD = db.password;
  process.env.DB_NAME = db.database;
  process.env.NODE_ENV = "test";
}, 120000);

afterAll(async () => {
  await stopMySql();
}, 120000);