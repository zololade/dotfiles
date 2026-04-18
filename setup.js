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

const DESTINATION = {
  config: path.join(HOME, ".config"),
  local: path.join(HOME, ".local", "bin"),
  home: HOME,
};

const LOCATION = {
  config: ".config",
  local: ".local/bin",
  home: ".",
};

const SYMLINK_ITEMS = [
  "btop",
  ["hyprland", "hypr"],
  "gammastep",
  "niri",
  "swayidle",
  "kitty",
  "rofi",
  "swaync",
  "waybar",
  "autostart",
  "wlogout",
  "starship.toml",
  "xdg-desktop-portal",
  ["coolwall.js", "coolwall.js", "local"],
  ["scripts", "scripts", "local"],
  "gtk-3.0",
  "gtk-4.0",
  "mimeapps.list",
  "nvim",
  "systemd/user",
  [".bashrc", ".bashrc", "home"],
  [".zshrc", ".zshrc", "home"],
  [".uxplayrc", ".uxplayrc", "home"],
  [".gitconfig", ".gitconfig", "home"],
];

function createSymlink(item) {
  let [source, destination, to] = Array.isArray(item)
    ? item
    : [item, item, "config"];
  destination = destination || source;
  to = to || "config";

  const currentPath = path.join(__dirname, LOCATION[to], source);
  const symlinkPath = path.join(DESTINATION[to], destination);

  if (!fs.existsSync(currentPath)) {
    console.warn(`[Warning] Missing source: ${currentPath}`);
    return;
  }

  fs.mkdirSync(path.dirname(symlinkPath), { recursive: true });

  // Use try/lstatSync because existsSync returns false for broken symlinks
  try {
    const stats = fs.lstatSync(symlinkPath);

    if (stats.isSymbolicLink()) {
      // Check if it already points to the right place
      if (fs.readlinkSync(symlinkPath) === currentPath) {
        console.log(
          `Skipping ${destination} (already correctly linked)`,
        );
        return;
      }
      // If it's a link but points elsewhere (or is broken), remove it to re-link
      fs.unlinkSync(symlinkPath);
    } else {
      // If it's a real file/folder, back it up
      const backupPath = path.join(
        DESTINATION[to],
        `${destination}_bak_${Date.now()}`,
      );
      console.log(
        `Backing up existing ${destination} to ${path.basename(backupPath)}`,
      );
      fs.renameSync(symlinkPath, backupPath);
    }
  } catch (e) {
    // File doesn't exist, which is fine!
  }

  console.log(`Linking ${destination} -> ${symlinkPath}`);
  fs.symlinkSync(currentPath, symlinkPath);
}

console.log("Starting symlink process...");
SYMLINK_ITEMS.forEach(createSymlink);

console.log("\nSetup complete.");
