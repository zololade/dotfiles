#!/usr/bin/env node

import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "child_process";

// === CONFIG ===
const API_KEY = "";
const HOME = os.homedir();

const WALLPAPER_DIR = path.join(HOME, "Pictures", "Wallpapers");
const LAST_RUN_FILE = path.join(HOME, ".last_wallpaper_run");
const HISTORY_FILE = path.join(HOME, ".wallpaper_history.log");

const CATEGORY = "100";
const PURITY = "100";
const SORTING = "random";
const MIN_RESOLUTION = "2560x1440";
const COLORS = "000000";
const MAX_WALLPAPERS = 8;
const RETRY_COUNT = 3;
const QUERY_LIST = ["minimal"];
const MAX_RESULTS = 8;

const SEED = new Date().toISOString().split("T")[0];

// === HELPERS ===
function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function requireCmd(cmd) {
  let ifExist = spawnSync(`which`, [cmd], { stdio: "ignore" });
  if (ifExist.status !== 0) {
    console.error(`Missing dependency: ${cmd}`);
    process.exit(1);
  }
}

["identify", "swww"].forEach(requireCmd);

// === INIT ===
fs.mkdirSync(WALLPAPER_DIR, { recursive: true });
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, "");

// Avoid multiple runs
if (fs.existsSync(LAST_RUN_FILE)) {
  const last = fs.readFileSync(LAST_RUN_FILE, "utf-8").trim();
  if (last === SEED) {
    log("Already ran today.");
    process.exit(0);
  }
}

// === FETCH ===
async function fetchWallpapers() {
  const params = new URLSearchParams({
    apikey: API_KEY,
    purity: PURITY,
    categories: CATEGORY,
    colors: COLORS,
    atleast: MIN_RESOLUTION,
    sorting: SORTING,
    seed: SEED,
    page: "1",
    q: QUERY_LIST.join(" "),
  });

  log("Fetching wallpapers...");

  const res = await fetch(
    `https://wallhaven.cc/api/v1/search?${params}`,
  );

  if (!res.ok) {
    console.error("Fetch failed.");
    process.exit(1);
  }

  const data = await res.json();
  return data.data.map((i) => i.path).slice(0, MAX_RESULTS);
}

// === DOWNLOAD ===
async function downloadWallpaper(url) {
  const ext = url.split(".").pop();
  const filename = path.join(
    WALLPAPER_DIR,
    `wallpaper_${Date.now()}.${ext}`,
  );

  log(`Downloading ${url}`);

  const res = await fetch(url);
  if (!res.ok) return null;

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filename, buffer);

  let isGoodImage = spawnSync(`identify`, [filename], {
    stdio: "ignore",
  });

  if (isGoodImage.status !== 0) {
    log("Invalid image, deleting...");
    fs.unlinkSync(filename);
    return null;
  }

  return filename;
}

// === APPLY ===
function applyWallpaper(file, url) {
  spawnSync("swww", [
    "img",
    file,
    "--transition-type",
    "any",
    "--transition-duration",
    "2",
  ]);

  fs.appendFileSync(HISTORY_FILE, url + "\n");
  fs.writeFileSync(path.join(HOME, ".current_wallpaper"), file);

  const script = path.join(HOME, ".config/hypr/scripts/image-grab");
  if (fs.existsSync(script)) {
    spawnSync(script);
  }

  fs.writeFileSync(LAST_RUN_FILE, SEED);
  log("Wallpaper applied.");
}

// === CLEANUP ===
function manageWallpapers() {
  const files = fs
    .readdirSync(WALLPAPER_DIR)
    .map((f) => path.join(WALLPAPER_DIR, f))
    .sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);

  if (files.length > MAX_WALLPAPERS) {
    files.slice(MAX_WALLPAPERS).forEach((f) => fs.unlinkSync(f));
    log("Cleaned old wallpapers.");
  }
}

// === MAIN ===
async function main() {
  const history = fs.readFileSync(HISTORY_FILE, "utf-8").split("\n");

  const urls = await fetchWallpapers();

  for (const url of urls) {
    if (history.includes(url)) {
      log(`Skipping used: ${url}`);
      continue;
    }

    for (let i = 0; i < RETRY_COUNT; i++) {
      const file = await downloadWallpaper(url);
      if (file) {
        applyWallpaper(file, url);
        manageWallpapers();
        return;
      }
    }
  }

  console.error("No suitable wallpaper found. omo abeg.");
}

main();
