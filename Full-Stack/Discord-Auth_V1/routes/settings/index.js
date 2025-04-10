const express = require("express")
const router = express.Router()
const { requireRole } = require("../../middleware/requireRole")
const { logAccess } = require("../../utils/audit")
const { getGuildMember } = require("../../services/discord")
const axios = require("axios")

const SERVER_ID = process.env.SERVER_ID
const DISCORD_API = "https://discord.com/api"

router.get("/settings", requireRole, async (req, res) => {
  logAccess({
    userId: req.session.userId,
    username: req.session.username,
    action: "ACCESS",
    route: "/settings",
  })

  const member = await getGuildMember(SERVER_ID, req.session.userId)

  const guildRoles = await axios.get(`${DISCORD_API}/guilds/${SERVER_ID}/roles`, {
    headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
  })

  const roleMap = Object.fromEntries(
    guildRoles.data.map(r => [r.id, r.name])
  )

  const roleNames = member.roles.map(id => ({ id, name: roleMap[id] || "Unknown" }))

  res.render("settings", {
    title: "Settings",
    user: {
      username: req.session.username,
      id: req.session.userId,
      roles: roleNames,
    },
  })
})

module.exports = router