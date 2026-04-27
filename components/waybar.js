import { generateTheme } from "./utils.js";

generateTheme("waybar", "colors.css", (c) =>
  Object.entries(c)
    .map(([n, v]) => `@define-color ${n} ${v};`)
    .join("\n"),
);
