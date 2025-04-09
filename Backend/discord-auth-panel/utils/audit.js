const fs = require("fs")
const path = require("path")

const LOG_FILE = path.join(__dirname, "../logs/audit.log")

function logAccess({
  userId = "guest",
  username = "anonymous",
  route = "unknown",
  action = "UNKNOWN",
  method = "GET",
  ip = "unknown"
}) {
  const timestamp = new Date().toISOString()
  const entry = `[${timestamp}] [${action}] ${username} (${userId}) ${method} ${route} from ${ip}\n`
  fs.appendFileSync(LOG_FILE, entry)
}

function readLogs(limit = 50) {
  if (!fs.existsSync(LOG_FILE)) return []
  const lines = fs.readFileSync(LOG_FILE, "utf-8").trim().split("\n")
  return lines.slice(-limit)
}

function filterLogs({ userId, route, action } = {}) {
  const logs = readLogs(200)
  return logs.filter(line => {
    console.log("LINE:", line) // debug
    const match = line.match(/\[(.+?)\] \[(.+?)\] (.+?) \((.+?)\) (\w+) (.+?) from (.+)/)
    if (!match) return false

    const [, , , lineUserId, lineRoute, lineAction] = match

    if (userId && lineUserId !== userId) return false
    if (route && lineRoute !== route) return false
    if (action && lineAction !== action) return false
    return true
  })
}


module.exports = { logAccess, readLogs, filterLogs }
