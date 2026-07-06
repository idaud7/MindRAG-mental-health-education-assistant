const { execSync } = require("child_process");

const PORTS = [3000, 8000];

function killPortWindows(port) {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set();

    for (const line of output.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5 && parts[1]?.endsWith(`:${port}`) && parts[3] === "LISTENING") {
        pids.add(parts[4]);
      }
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped process ${pid} on port ${port}`);
      } catch {
        // Process may already be gone.
      }
    }
  } catch {
    // No process on this port.
  }
}

if (process.platform === "win32") {
  for (const port of PORTS) {
    killPortWindows(port);
  }
}
