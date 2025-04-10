const request = require("supertest")
const { createTestApp } = require("./testSetup")
const router = require("../routes/auth")
const { exchangeCodeForToken, getUserInfo, getGuildMember } = require("../services/discord")
jest.mock("../services/discord")

const app = createTestApp()
app.use("/", router)

describe("GET /callback with valid token but missing required roles", () => {
  it("renders not-authorized view", async () => {
    exchangeCodeForToken.mockResolvedValue({ access_token: "abc", refresh_token: "r", expires_in: 3600 })
    getUserInfo.mockResolvedValue({ id: "123", username: "tester" })
    getGuildMember.mockResolvedValue({ roles: ["guest"] })

    const res = await request(app).get("/callback?code=valid")
    expect(res.status).toBe(200)
    expect(res.text).toContain("do not have access")
  })
})
