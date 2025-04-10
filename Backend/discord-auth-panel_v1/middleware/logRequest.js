const fs = require("fs")
const path = require("path")

const logFilePath = path.join(__dirname, "../logs/audit.log")

function logRequest(req, res, next) {
  const logEntry = {
    time: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    path: req.originalUrl,
    userId: req.session?.userId || "guest",
    username: req.session?.username || "anonymous"
  }

  const line = `[${logEntry.time}] ${logEntry.method} ${logEntry.path} by ${logEntry.username} (${logEntry.userId}) from ${logEntry.ip}\n`

  fs.appendFile(logFilePath, line, err => {
    if (err) console.error("❌ Failed to write audit log:", err)
  })

  next()
}

module.exports = logRequest
