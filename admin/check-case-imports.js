import fs from "fs";
import path from "path";
import { glob } from "glob";

const SRC_DIR = "./src";

function checkImports(file) {
  const content = fs.readFileSync(file, "utf8");

  // Regex for import and require
  const regex = /\b(?:import\s.*?from\s+|require\()\s*["'](.+?)["']/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];

    // Ignore node_modules & external libs
    if (!importPath.startsWith(".")) continue;

    const absPath = path.resolve(path.dirname(file), importPath);

    // Handle extensions automatically
    const filePath =
      fs.existsSync(absPath) && fs.lstatSync(absPath).isFile()
        ? absPath
        : [".js", ".jsx", ".ts", ".tsx", ".json", ".svg", ".png", ".webp"]
            .map((ext) => absPath + ext)
            .find((p) => fs.existsSync(p));

    if (!filePath) continue;

    // Check actual case on disk
    const dirFiles = fs.readdirSync(path.dirname(filePath));
    const actualName = path.basename(filePath);

    if (!dirFiles.includes(actualName)) {
      console.log(
        `❌ Case mismatch in ${file}\n   → Import: ${importPath}\n   → Actual: ${actualName}\n`
      );
    }
  }
}

(async () => {
  const files = await glob(`${SRC_DIR}/**/*.{js,jsx,ts,tsx}`);
  files.forEach(checkImports);
  console.log("✅ Case check completed");
})();
