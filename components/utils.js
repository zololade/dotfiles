import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const themePath = path.join(__dirname, "themes", "mocha.json");
const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));

const { colors, variants = {} } = theme;

/**
 * Generates a theme file by merging base colors with a specific variant
 * and applying a formatting template.
 */
function generateTheme(component, fileName, template) {
  const mergedColors = {
    ...colors,
    ...(variants.global || {}),
    ...(variants[component] || {}),
  };
  const content = template(mergedColors).trim() + "\n";
  const destPath = path.join(__dirname, ".config", component, fileName);

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, content);
  console.log(`› Generated ${component}/${fileName}`);
}

export { generateTheme, theme };
