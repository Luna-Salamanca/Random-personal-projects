const request = require("supertest")
const { createTestApp } = require("./testSetup")
const auditRoute = require("../routes/audit")
const { getGuildMember } = require("../services/discord")

jest.mock("../services/discord")
getGuildMember.mockResolvedValue({ roles: ["admin"] })

const app = createTestApp()
app.use("/", auditRoute) // ✅ correct mount

describe("/logs/audit route", () => {
  it("returns recent audit log lines", async () => {
    const res = await request(app).get("/logs/audit?limit=1")
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/LOGIN|ACCESS/)
  })
})
