const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const { requireRole } = require("../../middleware/requireRole")
const { filterLogs } = require("../../utils/audit")


const AUDIT_LOG_PATH = path.join(__dirname, "../../logs/audit.log")

function parseLogLine(line) {
  const match = line.match(/\[(.+?)\] \[(.+?)\] (.+?) \((.+?)\) (\w+) (.+?) from (.+)/)
  if (!match) return null
  const [ , timestamp, action, username, userId, method, route, ip ] = match
  return { timestamp, action, username, userId, method, route, ip }
}

router.get("/logs/audit", requireRole, (req, res) => {
  const limit = parseInt(req.query.limit || "100", 10)
  fs.readFile(AUDIT_LOG_PATH, "utf-8", (err, data) => {
    if (err) return res.status(500).send("Unable to read audit log")
    const lines = data.trim().split("\n")
    const recent = lines.slice(-limit).join("\n")
    res.setHeader("Content-Type", "text/plain")
    res.send(recent)
  })
})

router.get("/logs/audit/search", requireRole, (req, res) => {
  const { userId, route, action } = req.query
  
  console.log("Searching logs for:", { userId, route, action })

  const rawLogs = filterLogs({ userId, route, action })
  const logs = rawLogs.map(parseLogLine).filter(Boolean)

  res.render("audit-search", { logs, title: "Audit Search" })
})

module.exports = router
