#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themePath = path.join(__dirname, "themes", "mocha.json");
const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
const colors = theme.colors;

// 1. Generate Kitty Theme
const kittyContent =
  Object.entries(colors)
    .map(([name, hex]) => `color_${name} ${hex}\n# ${name}`)
    .join("\n") +
  `\nbackground ${colors.base}\nforeground ${colors.text}\nselection_background ${colors.rosewater}\nselection_foreground ${colors.base}\ncursor ${colors.rosewater}\n`;
fs.writeFileSync(
  path.join(__dirname, ".config", "kitty", "generated-colors.conf"),
  kittyContent,
);

// 2. Generate Waybar CSS
const waybarContent = `@define-color base ${colors.base};\n@define-color mantle ${colors.mantle};\n@define-color crust ${colors.crust};\n@define-color text ${colors.text};\n@define-color blue ${colors.blue};\n@define-color mauve ${colors.mauve};\n@define-color red ${colors.red};\n@define-color green ${colors.green};\n@define-color yellow ${colors.yellow};\n@define-color surface0 ${colors.surface0};\n@define-color surface1 ${colors.surface1};\n`;
fs.writeFileSync(
  path.join(__dirname, ".config", "waybar", "colors.css"),
  waybarContent,
);

// 3. Generate Rofi RASI
const rofiContent = `* {\n${Object.entries(colors)
  .map(([name, hex]) => `    ${name}: ${hex};`)
  .join("\n")}\n}\n`;
fs.writeFileSync(
  path.join(__dirname, ".config", "rofi", "catppuccin-mocha.rasi"),
  rofiContent,
);

// 4. Generate Niri KDL Snippet
const niriContent = `layout {\n    focus-ring {\n        active-color "${colors.blue}"\n        inactive-color "${colors.surface0}"\n    }\n}\n`;
fs.writeFileSync(
  path.join(__dirname, ".config", "niri", "config.d", "theme.kdl"),
  niriContent,
);

console.log("Themes generated successfully from " + theme.name);
