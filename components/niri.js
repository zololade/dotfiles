import { generateTheme } from "./utils.js";

generateTheme(
  "niri",
  "config.d/theme.kdl",
  (c) => `
layout {
    focus-ring {
        active-color "${c.surface1}"
        inactive-color "${c.surface0}"
    }
}
`,
);
