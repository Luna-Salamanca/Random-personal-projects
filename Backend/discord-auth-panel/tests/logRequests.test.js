const request = require("supertest")
const express = require("express")
const fs = require("fs")
const path = require("path")
const session = require("express-session")
const logRequest = require("../middleware/logRequest")

const LOG_PATH = path.join(__dirname, "../logs/audit.log")
if (!fs.existsSync(path.dirname(LOG_PATH))) fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true })

describe("logRequest middleware", () => {
  let app

  beforeEach(() => {
    app = express()
    app.use(session({ secret: "test", resave: false, saveUninitialized: true }))
    app.use((req, res, next) => {
      req.session.userId = "123"
      req.session.username = "tester"
      next()
    })
    app.use(logRequest)
    app.get("/test", (req, res) => res.send("OK"))
    if (fs.existsSync(LOG_PATH)) fs.unlinkSync(LOG_PATH)
  })

  it("logs a request with user session", async () => {
    await request(app).get("/test")
    const log = fs.readFileSync(LOG_PATH, "utf-8")
    expect(log).toContain("/test")
    expect(log).toContain("tester")
    expect(log).toContain("123")
  })

  it("logs a request without session", async () => {
    app = express()
    app.use(session({ secret: "test", resave: false, saveUninitialized: true }))
    app.use(logRequest)
    app.get("/anon", (req, res) => res.send("Anon"))
    await request(app).get("/anon")
    const log = fs.readFileSync(LOG_PATH, "utf-8")
    expect(log).toContain("/anon")
    expect(log).toContain("anonymous")
    expect(log).toContain("guest")
  })
})
