const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const backendDir = path.join(root, "backend");
const isWin = process.platform === "win32";
const python = path.join(
  backendDir,
  isWin ? ".venv/Scripts/python.exe" : ".venv/bin/python"
);

if (!fs.existsSync(python)) {
  console.error(
    "Backend venv not found. Run:\n  cd backend\n  python -m venv .venv\n  .venv\\Scripts\\activate\n  pip install -r requirements.txt"
  );
  process.exit(1);
}

const child = spawn(
  python,
  ["-m", "uvicorn", "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000"],
  { cwd: backendDir, stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 1));
