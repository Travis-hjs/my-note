const fs = require("node:fs");
const path = require("node:path");

const mode = process.argv[2];

if (!mode) {
  console.error("Usage: node scripts/clean-static.cjs <mode>");
  process.exit(1);
}

const target = path.resolve(__dirname, "../../static", mode);

fs.rmSync(target, { recursive: true, force: true });
