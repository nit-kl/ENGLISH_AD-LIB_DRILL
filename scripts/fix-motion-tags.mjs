import fs from "node:fs";
import path from "node:path";

const roots = ["apps/web/src/presentation"];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".tsx")) files.push(full);
  }
  return files;
}

for (const root of roots) {
  for (const file of walk(root)) {
    let content = fs.readFileSync(file, "utf8");
    const next = content
      .replaceAll("<motion.div", "<div")
      .replaceAll("</motion.div>", "</div>");
    if (next !== content) {
      fs.writeFileSync(file, next, "utf8");
      console.log("fixed:", file);
    }
  }
}
