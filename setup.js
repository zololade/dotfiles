#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import os from "os";
import { fileURLToPath } from "url";

// === CONFIG ===
const HOME = os.homedir();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = path.join(HOME, ".config");
const SYMLINK_FOLDERS = [
  { source: "btop", destination: "btop" },
  { source: "hyprland", destination: "hypr" },
  { source: "kitty", destination: "kitty" },
  { source: "rofi", destination: "rofi" },
  { source: "swaync", destination: "swaync" },
  { source: "waybar", destination: "waybar" },
  { source: "wlogout", destination: "wlogout" },
  { source: "starship.toml", destination: "starship.toml" },
  { source: "coolwall.js", destination: "coolwall.js" },
  { source: "gtk-3.0", destination: "gtk-3.0" },
  { source: "gtk-4.0", destination: "gtk-4.0" },
  { source: "mimeapps.list", destination: "mimeapps.list" },
];

function createSymlink({ source, destination }) {
  const currentPath = path.join(__dirname, "config", source);
  const symlinkPath = path.join(CONFIG, destination);

  if (!fs.existsSync(currentPath)) {
    console.log(`Missing source: ${source}`);
    return;
  }

  const exists = fs.existsSync(symlinkPath);

  if (exists) {
    const stat = fs.lstatSync(symlinkPath);

    if (stat.isSymbolicLink()) {
      console.log(`Skipping ${destination} (already linked)`);
      return;
    }

    const backupPath = path.join(
      CONFIG,
      `${destination}_bak_${Date.now()}`,
    );

    console.log(`Backing up ${destination}`);
    fs.renameSync(symlinkPath, backupPath);
  }

  console.log(`Linking ${destination}`);
  fs.symlinkSync(currentPath, symlinkPath);
}

SYMLINK_FOLDERS.forEach(createSymlink);
