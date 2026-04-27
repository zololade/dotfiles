import { generateTheme } from "./utils.js";

generateTheme(
  "niri",
  "config.d/theme.kdl",
  (c) => `
layout {
    focus-ring {
        active-color "${c.surface0}"
        inactive-color "${c.surface1}"
    }
}
`,
);
