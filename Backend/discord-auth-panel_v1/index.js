require("dotenv").config()
const express = require("express")
const session = require("express-session")
const path = require("path")
const { refreshToken } = require("./middleware/refreshToken")
const { ensureEnv } = require("./utils/env")
const expressLayouts = require("express-ejs-layouts")
const routes = require("./routes")
const logRequest = require("./middleware/logRequest")

// Validate .env variables
ensureEnv([
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REDIRECT_URI",
  "SERVER_ID",
  "SESSION_SECRET",
  "BOT_TOKEN"
])

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.set("layout", "layout")

app.use(expressLayouts)
app.use(express.static(path.join(__dirname, "public")))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  }
}))

app.use(refreshToken)
app.use(logRequest)

app.use((req, res, next) => {
  res.locals.user = req.session?.userId
    ? { username: req.session.username, id: req.session.userId }
    : null
  next()
})

app.use((req, res, next) => {
  res.locals.title = "Discord Panel"
  next()
})


app.use("/", routes)

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err)
  res.status(500).send("Something went wrong.")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
