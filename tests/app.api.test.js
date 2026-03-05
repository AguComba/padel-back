import { test, expect } from "vitest"
import request from "supertest"
import { createApp } from "../app.js"

test("GET /health responde OK", async () => {
    const app = createApp()

    const res = await request(app).get("/health")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
})