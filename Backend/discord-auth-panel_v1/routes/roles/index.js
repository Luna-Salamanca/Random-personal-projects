const express = require("express")
const router = express.Router()
const axios = require("axios")
const { requireRole } = require("../../middleware/requireRole")

const DISCORD_API = "https://discord.com/api"
const SERVER_ID = process.env.SERVER_ID

router.get("/roles", requireRole, async (req, res, next) => {
  try {
    const response = await axios.get(`${DISCORD_API}/guilds/${SERVER_ID}/roles`, {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    })

    const roles = response.data.sort((a, b) => b.position - a.position)
    res.render("roles", { title: "All Server Roles", roles })
  } catch (err) {
    next(err)
  }
})

module.exports = router
