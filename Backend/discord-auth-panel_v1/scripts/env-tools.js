// /scripts/env-tools.js
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const chalk = require("chalk")

const envPath = path.resolve(__dirname, "../.env")
const requiredKeys = [
  "CLIENT_ID",
  "CLIENT_SECRET",
  "REDIRECT_URI",
  "BOT_TOKEN",
  "SERVER_ID",
  "SESSION_SECRET"
]

function generateSecret() {
  return crypto.randomBytes(32).toString("hex")
}

function injectSecret() {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, "")
  }

  const env = fs.readFileSync(envPath, "utf-8")
  if (!env.includes("SESSION_SECRET=")) {
    const secret = generateSecret()
    fs.appendFileSync(envPath, `\nSESSION_SECRET=${secret}\n`)
    console.log(chalk.green("✅ SESSION_SECRET added to .env"))
  } else {
    console.log(chalk.yellow("ℹ️ SESSION_SECRET already exists"))
  }
}

function validateEnv() {
  if (!fs.existsSync(envPath)) {
    console.error(chalk.red("❌ .env file not found"))
    process.exit(1)
  }

  const env = fs.readFileSync(envPath, "utf-8")
  const missing = requiredKeys.filter(key => !env.includes(`${key}=`))

  if (missing.length > 0) {
    console.error(chalk.red.bold("❌ Missing required keys:\n"))
    missing.forEach(key => console.log(chalk.red(`- ${key}`)))
    process.exit(1)
  }

  console.log(chalk.green.bold("✅ All required environment keys are present.\n"))
}

// CLI usage
const cmd = process.argv[2]

if (cmd === "generate") injectSecret()
else if (cmd === "validate") validateEnv()
else {
  console.log(chalk.cyan("\nUsage:"))
  console.log("  node scripts/env-tools.js validate")
  console.log("  node scripts/env-tools.js generate\n")
}
