import { generateTheme } from "./utils.js";

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
