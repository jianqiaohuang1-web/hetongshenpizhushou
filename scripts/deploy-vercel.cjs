const { spawnSync } = require("node:child_process")
const { existsSync, readFileSync } = require("node:fs")
const { join } = require("node:path")

const projectRoot = join(__dirname, "..")
const envPath = join(projectRoot, ".env.local")

function readEnvFile() {
  if (!existsSync(envPath)) {
    console.error("ERROR: .env.local was not found.")
    console.error("Please create it before deploying.")
    process.exit(1)
  }

  const env = {}
  const content = readFileSync(envPath, "utf8")

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const index = trimmed.indexOf("=")
    if (index === -1) continue
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1)
  }

  return env
}

function requireValue(env, key) {
  const value = env[key]
  if (!value || value.includes("paste_") || value.includes("your_")) {
    console.error(`ERROR: ${key} is missing in .env.local.`)
    process.exit(1)
  }
  return value
}

const env = readEnvFile()
const deploymentEnv = {
  COZE_TOKEN: requireValue(env, "COZE_TOKEN"),
  COZE_WORKFLOW_ID: requireValue(env, "COZE_WORKFLOW_ID"),
  COZE_CONTRACT_TEXT_FIELD: env.COZE_CONTRACT_TEXT_FIELD || "input",
  COZE_FILE_NAME_FIELD: env.COZE_FILE_NAME_FIELD || "file_name",
}

console.log("==========================================")
console.log("Deploy AI Contract Review Demo to Vercel")
console.log("==========================================")
console.log("")
console.log("This will deploy the current project to Vercel.")
console.log("If Vercel asks you to log in, follow the browser prompt.")
console.log("")

if (process.argv.includes("--dry-run")) {
  console.log("Configuration looks ready.")
  console.log("Run deploy-vercel.bat to start deployment.")
  process.exit(0)
}

const args = [
  "vercel@latest",
  "deploy",
  "--prod",
  "--yes",
  "--env",
  `COZE_TOKEN=${deploymentEnv.COZE_TOKEN}`,
  "--env",
  `COZE_WORKFLOW_ID=${deploymentEnv.COZE_WORKFLOW_ID}`,
  "--env",
  `COZE_CONTRACT_TEXT_FIELD=${deploymentEnv.COZE_CONTRACT_TEXT_FIELD}`,
  "--env",
  `COZE_FILE_NAME_FIELD=${deploymentEnv.COZE_FILE_NAME_FIELD}`,
]

const result = spawnSync("npx.cmd", args, {
  cwd: projectRoot,
  stdio: "inherit",
  shell: false,
})

process.exit(result.status ?? 1)
