const request = require("supertest")
const { createTestApp } = require("./testSetup")
const rolesRoute = require("../routes/roles")
const { getGuildMember } = require("../services/discord")
jest.mock("../services/discord")

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: [
      { id: "1", name: "Admin", position: 2 },
      { id: "2", name: "Mod", position: 1 }
    ]
  })
}))

getGuildMember.mockResolvedValue({ roles: ["admin"] })
const app = createTestApp()
app.use("/", rolesRoute)

describe("GET /roles", () => {
  it("renders sorted roles list with badge titles", async () => {
    const res = await request(app).get("/roles")
    expect(res.status).toBe(200)
    expect(res.text).toContain("Admin")
    expect(res.text).toContain("Mod")
    expect(res.text).toContain('title="1"')
  })
})
