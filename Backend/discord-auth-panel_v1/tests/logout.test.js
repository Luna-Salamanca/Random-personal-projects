const request = require("supertest")
const { createTestApp } = require("./testSetup")
const router = require("../routes/auth")

jest.spyOn(console, "log").mockImplementation(() => {})
jest.spyOn(console, "error").mockImplementation(() => {})

describe("GET /logout", () => {
  it("clears session and redirects to homepage", async () => {
    const app = createTestApp()
    app.use("/", router)

    const agent = request.agent(app)
    const logoutRes = await agent.get("/logout")
    expect(logoutRes.status).toBe(302)
    expect(logoutRes.header.location).toBe("/")

    const anonApp = createTestApp(undefined, false)
    anonApp.use("/", router)

    const homeRes = await request(anonApp).get("/")
    expect(homeRes.status).toBe(200)
    expect(homeRes.text).toContain("Login with Discord")
  })
})
