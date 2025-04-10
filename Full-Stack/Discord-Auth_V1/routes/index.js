// Central router
const express = require("express")
const router = express.Router()

const authRoutes = require("./auth")
const settingsRoutes = require("./settings")
const auditRoutes = require("./audit")
const configRoute = require("./config")
const rolesRoute = require("./roles")

router.use("/", authRoutes)
router.use("/", settingsRoutes)
router.use("/", configRoute)
router.use("/", rolesRoute)
router.use("/", auditRoutes)



module.exports = router