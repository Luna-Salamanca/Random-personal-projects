const fs = require("fs")
const path = require("path")
const { logAccess, filterLogs } = require("../utils/audit")

const LOG_FILE = path.join(__dirname, "../logs/audit.log")

beforeAll(() => {
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE))
  }
  fs.writeFileSync(LOG_FILE, "") // clean slate
})

describe("Audit Log Filtering", () => {
  beforeAll(() => {
    logAccess({ userId: "123", username: "tester", route: "/admin", action: "LOGIN" })
    logAccess({ userId: "456", username: "user2", route: "/settings", action: "ACCESS" })
    logAccess({ userId: "123", username: "tester", route: "/admin", action: "ACCESS" })
  })

  it("filters by userId", () => {
    const results = filterLogs({ userId: "123" })
    expect(results.length).toBe(2)
    results.forEach(line => expect(line).toContain("(123)"))
  })

  it("filters by route", () => {
    const results = filterLogs({ route: "/settings" })
    expect(results.length).toBe(1)
    expect(results[0]).toContain("/settings")
  })

  it("filters by action", () => {
    const results = filterLogs({ action: "LOGIN" })
    expect(results.length).toBe(1)
    expect(results[0]).toContain("LOGIN")
  })

  it("filters by multiple fields", () => {
    const results = filterLogs({ userId: "123", action: "ACCESS" })
    expect(results.length).toBe(1)
    expect(results[0]).toContain("/admin")
  })
})
