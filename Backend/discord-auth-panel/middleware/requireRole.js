const { getGuildMember } = require("../services/discord")
const { DEFAULT_REQUIRED_ROLES } = require("../constants/discord")

const SERVER_ID = process.env.SERVER_ID
const REQUIRED_ROLES = process.env.REQUIRED_ROLES?.split(",") || DEFAULT_REQUIRED_ROLES

const requireRole = async (req, res, next) => {
  if (!req.session?.userId) return res.status(403).send("Login required")

  try {
    const member = await getGuildMember(SERVER_ID, req.session.userId)
    const hasRole = REQUIRED_ROLES.length === 0 || REQUIRED_ROLES.some(r => member.roles.includes(r))
    if (!hasRole) return res.status(403).send("Insufficient role")
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { requireRole }