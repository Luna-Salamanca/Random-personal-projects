const request = require("supertest")
const { createTestApp } = require("./testSetup")
const router = require("../routes/auth")

jest.spyOn(console, "log").mockImplementation(() => {})
jest.spyOn(console, "error").mockImplementation(() => {})

describe("GET /", () => {
  it("shows login for anonymous users", async () => {
    const app = createTestApp(undefined, false)
    app.use("/", router)

    const res = await request(app).get("/")
    expect(res.status).toBe(200)
    expect(res.text).toContain("Login with Discord")
  })

  it("shows welcome for logged-in users", async () => {
    const app = createTestApp()
    app.use("/", router)

    const res = await request(app).get("/")
    expect(res.status).toBe(200)
    expect(res.text).toContain("Welcome")
    expect(res.text).toContain("tester")
  })
})
