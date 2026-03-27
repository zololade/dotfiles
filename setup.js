#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import os from "os";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

// === CONFIG ===
const HOME = os.homedir();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = path.join(HOME, ".config");
const LOCAL = path.join(HOME, ".local", "bin");

const SYMLINK_FOLDERS = [
  { source: "btop", destination: "btop", home: "config" },
  { source: "hyprland", destination: "hypr", home: "config" },
  { source: "kitty", destination: "kitty", home: "config" },
  { source: "rofi", destination: "rofi", home: "config" },
  { source: "swaync", destination: "swaync", home: "config" },
  { source: "waybar", destination: "waybar", home: "config" },
  { source: "wlogout", destination: "wlogout", home: "config" },
  {
    source: "starship.toml",
    destination: "starship.toml",
    home: "config",
  },
  {
    source: "coolwall.js",
    destination: "coolwall.js",
    home: "local",
  },
  { source: "gtk-3.0", destination: "gtk-3.0", home: "config" },
  { source: "gtk-4.0", destination: "gtk-4.0", home: "config" },
  {
    source: "mimeapps.list",
    destination: "mimeapps.list",
    home: "config",
  },
  { source: "nvim", destination: "nvim", home: "config" },
  {
    source: "systemd/user",
    destination: "systemd/user",
    home: "config",
  },
];

//==== make dirs ====
fs.mkdirSync(path.join(CONFIG, "systemd"), { recursive: true });
fs.mkdirSync(LOCAL, { recursive: true });

const LOCATIONS = {
  config: CONFIG,
  local: LOCAL,
};

function createSymlink({ source, destination, home }) {
  const currentPath = path.join(__dirname, "config", source);
  const symlinkPath = path.join(LOCATIONS[home], destination);

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

spawnSync("systemctl", [
  "--user",
  "enable",
  "--now",
  "coolwall.timer",
]);
