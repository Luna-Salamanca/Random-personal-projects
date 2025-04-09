const request = require("supertest")
const { createTestApp } = require("./testSetup")
const router = require("../routes/auth")
const { exchangeCodeForToken, getUserInfo, getGuildMember } = require("../services/discord")
jest.mock("../services/discord")

const app = createTestApp()
app.use("/", router)

describe("/callback OAuth flow", () => {
  it("sets session and redirects to /admin", async () => {
    exchangeCodeForToken.mockResolvedValue({ access_token: "abc", refresh_token: "r", expires_in: 3600 })
    getUserInfo.mockResolvedValue({ id: "123", username: "tester" })
    getGuildMember.mockResolvedValue({ roles: ["admin"] })

    const res = await request(app).get("/callback?code=valid")
    expect(res.status).toBe(302)
    expect(res.header.location).toBe("/admin")
  })
})
