const express = require("express")
const router = express.Router()
const {
  exchangeCodeForToken,
  getUserInfo,
  getGuildMember
} = require("../../services/discord")
const { requireRole } = require("../../middleware/requireRole")
const { logAccess } = require("../../utils/audit")
const { DEFAULT_REQUIRED_ROLES } = require("../../constants/discord")

const SERVER_ID = process.env.SERVER_ID
const REQUIRED_ROLES = process.env.REQUIRED_ROLES?.split(",") || DEFAULT_REQUIRED_ROLES

router.get("/login", (req, res) => {
  logAccess({
    userId: "guest",
    username: "anonymous",
    route: "/login",
    method: "GET",
    status: "VISIT",
    ip: req.ip
  })

  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(
    process.env.REDIRECT_URI
  )}&response_type=code&scope=identify guilds`
  res.redirect(url)
})

router.get("/callback", async (req, res) => {
  const { code } = req.query
  if (!code) return res.status(400).send("Missing code")

  try {
    const tokenData = await exchangeCodeForToken(code)
    if (!tokenData || !tokenData.access_token) {
      console.warn("❌ No access_token received from Discord")
      return res.status(401).send("OAuth failed. No access token.")
    }

    const user = await getUserInfo(tokenData.access_token)
    const member = await getGuildMember(SERVER_ID, user.id)
    const hasRole = REQUIRED_ROLES.some(role => member.roles.includes(role))

    logAccess({
      userId: user.id,
      username: user.username,
      route: "/callback",
      method: "GET",
      status: hasRole ? "LOGIN" : "REJECTED",
      ip: req.ip
    })

    if (!hasRole) return res.render("not-authorized", { title: "Access Denied" })

    req.session.userId = user.id
    req.session.username = user.username
    req.session.accessToken = tokenData.access_token
    req.session.refreshToken = tokenData.refresh_token
    req.session.expiresAt = Date.now() + tokenData.expires_in * 1000

    res.redirect("/admin")
  } catch (err) {
    console.error("❌ OAuth2 callback error:", err.response?.data || err.message)
    res.status(500).send("Authentication failed.")
  }
})

router.get("/admin", requireRole, (req, res) => {
  logAccess({
    userId: req.session.userId,
    username: req.session.username,
    route: "/admin",
    method: "GET",
    status: "ACCESS",
    ip: req.ip
  })
  res.render("admin", { title: "Admin Panel" })
})

router.get("/logout", (req, res) => {
  logAccess({
    userId: req.session?.userId || "guest",
    username: req.session?.username || "anonymous",
    route: "/logout",
    method: "GET",
    status: "LOGOUT",
    ip: req.ip
  })

  req.session.destroy(() => res.redirect("/"))
})

router.get("/", (req, res) => {
  logAccess({
    userId: req.session?.userId || "guest",
    username: req.session?.username || "anonymous",
    route: "/",
    method: "GET",
    status: "VISIT",
    ip: req.ip
  })

  res.render("home", { title: "Home" })
})

module.exports = router
