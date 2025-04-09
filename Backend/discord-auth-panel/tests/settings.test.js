const request = require("supertest")
const { createTestApp } = require("./testSetup")
const settingsRoute = require("../routes/settings")

jest.spyOn(console, "log").mockImplementation(() => {})
jest.spyOn(console, "error").mockImplementation(() => {})

const { getGuildMember } = require("../services/discord")
jest.mock("../services/discord")

jest.mock("axios", () => ({
  get: jest.fn().mockImplementation((url) => {
    if (url.includes("/roles")) {
      return Promise.resolve({
        data: [
          { id: "admin", name: "Admin" },
          { id: "mod", name: "Mod" }
        ]
      })
    }
    return Promise.resolve({ data: {} })
  })
}))

describe("/settings route", () => {
  it("renders settings page with valid session and role", async () => {
    const app = createTestApp()
    app.use("/", settingsRoute)

    getGuildMember.mockResolvedValue({ roles: ["admin"] })

    const res = await request(app).get("/settings")
    expect(res.status).toBe(200)
    expect(res.text).toContain("tester")
    expect(res.text).toContain("Admin")
  })
})
