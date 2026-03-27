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

// These are where the links will be created on your SYSTEM
const DESTINATION = {
  config: path.join(HOME, ".config"),
  local: path.join(HOME, ".local", "bin"),
};

// These are where the files live in your REPO
const LOCATION = {
  config: ".config",
  local: ".config",
};

// Simplified symlink list
const SYMLINK_ITEMS = [
  "btop",
  ["hyprland", "hypr"],
  "kitty",
  "rofi",
  "swaync",
  "waybar",
  "wlogout",
  "starship.toml",
  ["coolwall.js", "coolwall.js", "local"],
  "gtk-3.0",
  "gtk-4.0",
  "mimeapps.list",
  "nvim",
  "systemd/user",
];

function createSymlink(item) {
  let source, destination, to;

  if (Array.isArray(item)) {
    source = item[0];
    destination = item[1] || source;
    to = item[2] || "config";
  } else {
    source = destination = item;
    to = "config";
  }

  // Source: The file in your dotfiles folder
  const currentPath = path.join(__dirname, LOCATION[to], source);
  // Target: The place in ~/.config or ~/.local/bin
  const symlinkPath = path.join(DESTINATION[to], destination);

  if (!fs.existsSync(currentPath)) {
    console.warn(`[Warning] Missing source: ${currentPath}`);
    return;
  }

  // Ensure the parent directory (like ~/.config/systemd) exists
  fs.mkdirSync(path.dirname(symlinkPath), { recursive: true });

  if (fs.existsSync(symlinkPath)) {
    const stat = fs.lstatSync(symlinkPath);

    if (stat.isSymbolicLink()) {
      console.log(`Skipping ${destination} (already linked)`);
      return;
    }

    // Fixed: Changed LOCATIONS to DESTINATION to prevent ReferenceError
    const backupPath = path.join(
      DESTINATION[to],
      `${destination}_bak_${Date.now()}`,
    );

    console.log(
      `Backing up existing ${destination} to ${path.basename(backupPath)}`,
    );
    fs.renameSync(symlinkPath, backupPath);
  }

  console.log(`Linking ${destination} -> ${symlinkPath}`);
  try {
    fs.symlinkSync(currentPath, symlinkPath);
  } catch (err) {
    console.error(`Failed to link ${destination}: ${err.message}`);
  }
}

// Create symlinks
console.log("Starting symlink process...");
SYMLINK_ITEMS.forEach(createSymlink);
console.log("Symlink process complete.\n");

// Enable systemd timer
console.log("Enabling coolwall.timer...");
const systemctl = spawnSync(
  "systemctl",
  ["--user", "enable", "--now", "coolwall.timer"],
  { stdio: "inherit" },
);

if (systemctl.error) {
  console.error(
    `Failed to execute systemctl: ${systemctl.error.message}`,
  );
}
