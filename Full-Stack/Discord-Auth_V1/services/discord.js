const axios = require("axios")
const qs = require("querystring")
const DISCORD_API = "https://discord.com/api"

async function exchangeCodeForToken(code) {
  const body = qs.stringify({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: "identify guilds"
  })

  const res = await axios.post(`${DISCORD_API}/oauth2/token`, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })

  const data = res.data

  if (!data || !data.access_token || !data.refresh_token || !data.expires_in) {
    throw new Error("Incomplete token response from Discord")
  }

  return data
}

async function getUserInfo(accessToken) {
  const res = await axios.get(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return res.data
}

async function getGuildMember(guildId, userId) {
  const res = await axios.get(`${DISCORD_API}/guilds/${guildId}/members/${userId}`, {
    headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` }
  })
  return res.data
}

module.exports = {
  exchangeCodeForToken,
  getUserInfo,
  getGuildMember
}