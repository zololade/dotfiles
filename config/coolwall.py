#!/home/ololade/.my_private_envs/coolwall/bin/python3.13
"""cool wallpaper script"""

import shutil
import json
import sys
import datetime
import logging
from pathlib import Path
import os
import subprocess
import requests


# === CONFIGURATION ===
API_KEY = ""
WALLPAPER_DIR = Path.home() / "Pictures" / "Wallpapers"
CATEGORY = "100"  # 010: Anime, 100: General, 001: People
PURITY = "100"  # 100: SFW, 110: SFW+Suggestive
SORTING = "random"
MIN_RESOLUTION = "2560x1440"
COLORS = "000000"
MAX_WALLPAPERS = 8
RETRY_COUNT = 3
LAST_RUN_FILE = Path.home() / ".last_wallpaper_run"
HISTORY_FILE = Path.home() / ".wallpaper_history.log"
QUERY_LIST = ["landscape", "digital art"]
MAX_RESULTS = 8
SEED = datetime.date.today().isoformat()

# === LOGGING ===
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


# === DEPENDENCY CHECK ===
def require(command):
    """
    Check if a command is available on the system.

    Args:
        command (str): The command to check.

    Raises:
        SystemExit: If the command is not found.
    """
    if shutil.which(command) is None:
        logging.error("Missing dependency: %s", command)
        sys.exit(1)


for cmd in ["curl", "jq", "identify", "swww"]:
    require(cmd)

# === ENSURE DIRECTORIES & FILES ===
WALLPAPER_DIR.mkdir(parents=True, exist_ok=True)
HISTORY_FILE.touch(exist_ok=True)

# === AVOID MULTIPLE DAILY RUNS ===
if LAST_RUN_FILE.exists() and LAST_RUN_FILE.read_text().strip() == SEED:
    logging.info("Script already ran today.")
    sys.exit(0)


# === INTERNET CONNECTIVITY CHECK ===
def is_connected():
    """
    Check if the system has an active internet connection.

    This function uses the `ping` command to check if the system can reach a
    remote host (in this case, 8.8.8.8).
    If the ping is successful, the function returns True, indicating that
    the system has an active internet connection.
    If the ping fails, the function returns False.

    Returns:
        bool: True if the system has an active internet connection,
        False otherwise.
    """
    try:
        subprocess.run(
            ["ping", "-q", "-c", "1", "-W", "2", "8.8.8.8"],
            stdout=subprocess.DEVNULL,
            check=True,
        )
        return True
    except subprocess.CalledProcessError:
        return False


if not is_connected():
    logging.error("No internet connection.")
    sys.exit(1)


# === FETCH WALLPAPER JSON ===
def fetch_wallpapers():
    """
    Fetches a list of wallpapers from the Wallhaven API.

    Returns:
        list: A list of wallpaper URLs.
    """
    params = {
        "apikey": API_KEY,
        "purity": PURITY,
        "categories": CATEGORY,
        "colors": COLORS,
        "atleast": MIN_RESOLUTION,
        "sorting": SORTING,
        "seed": SEED,
        "page": 1,
        "q": " ".join(QUERY_LIST),
    }

    headers = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}

    logging.info("Fetching wallpapers from Wallhaven...")
    response = requests.get(
        "https://wallhaven.cc/api/v1/search",
        params=params,
        headers=headers,
        timeout=10,
    )

    if not response.ok:
        logging.error("Failed to fetch wallpapers.")
        sys.exit(1)

    try:
        data = response.json()
        return [item["path"] for item in data.get("data", [])][:MAX_RESULTS]
    except json.JSONDecodeError:
        logging.error("Invalid JSON response.")
        sys.exit(1)


# === DOWNLOAD & APPLY WALLPAPER ===
def download_wallpaper(image_url):
    """
    Downloads a wallpaper from the given URL and saves it to the local file
    system.

    Args:
        image_url (str): The URL of the wallpaper to download.

    Returns:
        str: The path to the downloaded wallpaper file, or None if the
        download fails.
    """
    ext = image_url.split(".")[-1]
    filename = WALLPAPER_DIR / (
        f"wallpaper_{int(datetime.datetime.now().timestamp())}.{ext}"
    )

    logging.info("Downloading: %s", image_url)
    with open(filename, "wb") as f:
        response = requests.get(image_url, stream=True, timeout=10)
        if response.status_code == 200:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        else:
            logging.warning("Download failed.")
            return None

    # Validate image
    try:
        subprocess.run(
            ["identify", str(filename)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )
    except subprocess.CalledProcessError:
        logging.warning("Invalid image, skipping.")
        filename.unlink(missing_ok=True)
        return None

    return filename


# === APPLY WALLPAPER & UPDATE STATE ===
def apply_wallpaper(file_path, image_url):
    """
    Applies a wallpaper to the system and updates the state.

    Args:
        file_path (str): The path to the wallpaper file.
        image_url (str): The URL of the wallpaper image.

    Returns:
        None
    """
    subprocess.run(
        [
            "swww",
            "img",
            str(file_path),
            "--transition-type",
            "any",
            "--transition-duration",
            "2",
        ],
        check=True,
    )
    with open(HISTORY_FILE, "a", encoding="utf-8") as hist:
        hist.write(image_url + "\n")
    current_wallpaper_path = Path.home() / ".current_wallpaper"
    with open(current_wallpaper_path, "w", encoding="utf-8") as curr:
        curr.write(str(file_path))

    # Optional image-grab script
    script_path = Path.home() / ".config" / "hypr" / "scripts" / "image-grab"
    if script_path.exists() and os.access(script_path, os.X_OK):
        subprocess.run([str(script_path)], check=True)

    logging.info("Wallpaper applied successfully!")
    LAST_RUN_FILE.write_text(SEED)


# === MANAGE OLD WALLPAPERS ===
def manage_wallpapers():
    """
    Manage old wallpapers by deleting excess files.

    This function sorts the files in the wallpaper directory by their last
    modified time, and deletes any files that exceed the maximum allowed
    number of wallpapers.

    Returns:
        None
    """
    files = sorted(WALLPAPER_DIR.glob("*"), key=os.path.getmtime, reverse=True)
    if len(files) > MAX_WALLPAPERS:
        for file in files[MAX_WALLPAPERS:]:
            file.unlink()
        logging.info("Old wallpapers cleaned up.")


# === MAIN WORKFLOW ===
def main():
    """
    The main entry point of the script.

    This function fetches a list of wallpapers, downloads and applies a new
    wallpaper, and manages old wallpapers.

    Returns:
        None
    """
    history = HISTORY_FILE.read_text().splitlines()
    image_urls = fetch_wallpapers()

    for image_url in image_urls:
        if image_url in history:
            logging.info("Already used: %s", image_url)
            continue

        for _ in range(RETRY_COUNT):
            wallpaper = download_wallpaper(image_url)
            if wallpaper:
                apply_wallpaper(wallpaper, image_url)
                manage_wallpapers()
                return

    logging.error(
        (
            "No suitable wallpaper found after %d attempts, omo abeg",
            RETRY_COUNT,
        )
    )


if __name__ == "__main__":
    main()
