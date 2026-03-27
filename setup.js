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
  "btop",
  "hyprland",
  "kitty",
  "rofi",
  "swaync",
  "waybar",
  "wlogout",
  "starship.toml",
];

function createSymlink(folder) {
  const currentPath = path.join(__dirname, "config", folder);
  const symlinkPath = path.join(CONFIG, folder);
  const isExistingPath = fs.existsSync(symlinkPath);
  const isSymlink =
    isExistingPath && fs.lstatSync(symlinkPath).isSymbolicLink();

  if (isSymlink) return;
  if (isExistingPath && !isSymlink) {
    fs.renameSync(symlinkPath, path.join(CONFIG, `${folder}_bak`));
  }

  fs.symlinkSync(currentPath, symlinkPath);
}

SYMLINK_FOLDERS.forEach(createSymlink);
