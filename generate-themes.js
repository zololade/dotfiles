#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

// 1. Kitty Theme
generateTheme(
  "kitty",
  "generated-colors.conf",
  (c) => `
${Object.entries(c)
  .map(([n, v]) => `color_${n} ${v}`)
  .join("\n")}

background ${c.base}
foreground ${c.text}
selection_background ${c.rosewater}
selection_foreground ${c.base}
cursor ${c.rosewater}
`,
);

// 2. Waybar CSS
generateTheme("waybar", "colors.css", (c) =>
  Object.entries(c)
    .map(([n, v]) => `@define-color ${n} ${v};`)
    .join("\n"),
);

// 3. Rofi RASI
generateTheme(
  "rofi",
  "catppuccin-mocha.rasi",
  (c) => `
* {
${Object.entries(c)
  .map(([n, v]) => `    ${n}: ${v};`)
  .join("\n")}
}
`,
);

// 4. Niri KDL Snippet
generateTheme(
  "niri",
  "config.d/theme.kdl",
  (c) => `
layout {
    focus-ring {
        active-color "${c.mauve}"
        inactive-color "${c.surface1}"
    }
}
`,
);

console.log(`\nDone! Applied "${theme.name}" variants.`);
