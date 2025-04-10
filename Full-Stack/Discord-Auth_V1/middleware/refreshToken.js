const axios = require("axios")
const { logAccess } = require("../utils/audit")

const DISCORD_API = "https://discord.com/api"

async function refreshToken(req, res, next) {
  const { accessToken, refreshToken, expiresAt } = req.session || {}

  if (!accessToken || !refreshToken || !expiresAt || Date.now() < expiresAt - 5000) {
    return next()
  }

  try {
    const body = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: process.env.REDIRECT_URI,
      scope: "identify guilds"
    })

    const resToken = await axios.post(`${DISCORD_API}/oauth2/token`, body.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    req.session.accessToken = resToken.data.access_token
    req.session.refreshToken = resToken.data.refresh_token
    req.session.expiresAt = Date.now() + resToken.data.expires_in * 1000
    next()
  } catch (err) {
    console.error("Token refresh failed:", err.response?.data || err.message)
    logAccess({
      userId: req.session.userId,
      username: req.session.username,
      action: "REFRESH_FAIL",
      route: req.originalUrl || "middleware",
    })
    req.session.destroy(() => {
      res.render("not-authorized", { title: "Session Expired", error: "Your session has expired. Please log in again." })
    })
  }
}

module.exports = { refreshToken }