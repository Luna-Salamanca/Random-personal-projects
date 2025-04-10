const express = require("express")
const router = express.Router()

router.get("/config", (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI,
    scopes: "identify guilds"
  })
})

module.exports = router
