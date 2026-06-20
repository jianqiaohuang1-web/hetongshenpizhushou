const { spawn, exec } = require("node:child_process")

const url = "http://localhost:3000"

console.log("==========================================")
console.log("AI Contract Review Demo")
console.log("==========================================")
console.log("")
console.log(`Starting local server: ${url}`)
console.log("Keep this window open while using the website.")
console.log("")

const server =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", "npm.cmd run dev -- --port 3000"], {
        stdio: "inherit",
      })
    : spawn("npm", ["run", "dev", "--", "--port", "3000"], {
        stdio: "inherit",
      })

let opened = false

function openBrowser() {
  if (opened) return
  opened = true

  if (process.platform === "win32") {
    spawn("cmd.exe", ["/d", "/s", "/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
    }).unref()
    return
  }

  const command = process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`
  exec(command)
}

setTimeout(openBrowser, 5000)

server.on("exit", (code) => {
  process.exit(code ?? 0)
})

process.on("SIGINT", () => {
  server.kill("SIGINT")
})
