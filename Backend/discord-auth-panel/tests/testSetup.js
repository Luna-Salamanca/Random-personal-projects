process.env.REQUIRED_ROLES = "admin"

const express = require("express")
const session = require("express-session")

function createTestApp(viewPath = __dirname + "/../views", loggedIn = true) {
  const app = express()
  app.set("view engine", "ejs")
  app.set("views", viewPath)
  app.use(session({ secret: "test", resave: false, saveUninitialized: true }))

  if (loggedIn) {
    app.use((req, res, next) => {
      req.session.userId = "123"
      req.session.username = "tester"
      res.locals.user = { id: "123", username: "tester" }
      next()
    })
  } else {
    app.use((req, res, next) => {
      res.locals.user = null
      next()
    })
  }

  return app
}

module.exports = { createTestApp }
