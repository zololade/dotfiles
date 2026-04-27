#!/usr/bin/env node

import { theme } from "./components/utils.js";
import "./components/rofi.js";
import "./components/waybar.js";
import "./components/niri.js";
import "./components/kitty.js";

console.log(`\nDone! Applied "${theme.name}" variants.`);
