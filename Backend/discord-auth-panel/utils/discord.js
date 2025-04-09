const axios = require("axios")
const qs = require("querystring")
const memberCache = new Map() // Cache { `${guildId}:${userId}`: { roles, timestamp } }

const exchangeCodeForToken = async code => {
  const data = qs.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: "identify guilds",
  })

  const res = await axios.post("https://discord.com/api/oauth2/token", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })

  return res.data.access_token
}

const getUserInfo = async token => {
  const res = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const getGuildMember = async (guildId, userId) => {
  const cacheKey = `${guildId}:${userId}`
  const cached = memberCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < 60_000) {
    return cached.data
  }

  const res = await axios.get(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
    headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
  })

  const data = res.data
  memberCache.set(cacheKey, { data, timestamp: Date.now() })
  return data
}

module.exports = {
  exchangeCodeForToken,
  getUserInfo,
  getGuildMember,
}