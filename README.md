# dotfiles

Personal dotfiles for my Hyprland setup on **openSUSE Tumbleweed**.

---

## 🖥️ System

| | |
|---|---|
| **OS** | openSUSE Tumbleweed |
| **WM** | Hyprland 0.54 |
| **Shell** | bash + Starship |
| **Terminal** | Kitty |
| **Editor** | Zed/vscode |
| **Theme** | Catppuccin Mocha |

---

## 📦 Components

| Component | Tool |
|---|---|
| Compositor | Hyprland |
| Bar | Waybar |
| Launcher | Rofi |
| Notifications | Dunst |
| Lock screen | Hyprlock |
| Idle daemon | Hypridle |
| Logout menu | Wlogout |
| Wallpaper | coolwall |

---

## 📁 Structure

```
config/
├── hyprland/       # Hyprland compositor config (modular config.d/)
├── waybar/         # Bar config, modules, themes
├── kitty/          # Terminal + Catppuccin themes
├── rofi/           # Launcher config + Catppuccin theme
├── dunst/          # Notification daemon
├── wlogout/        # Logout menu icons (all Catppuccin flavours)
└── zed/            # Editor settings + themes
```

---

## ⚙️ System Setup

These are system-level settings that don't live in config files. Run these on a fresh install.

### CPU Optimization (auto-cpufreq)

Automatically manages CPU governor based on load and power state.

```bash
# Mask conflicting services
sudo systemctl mask power-profiles-daemon
sudo systemctl mask cpupower

# Install via official installer
git clone https://github.com/AdnanHodzic/auto-cpufreq.git
cd auto-cpufreq && sudo ./auto-cpufreq-installer

# Install the daemon (must be run as full root shell)
sudo su
auto-cpufreq --install
exit

# Create symlink so sudo can find it
sudo rm -f /usr/local/bin/auto-cpufreq
sudo ln -s /opt/auto-cpufreq/venv/bin/auto-cpufreq /usr/local/bin/auto-cpufreq
# This might not work even with the symlink, so you may need to run it with the full path: /opt/auto-cpufreq/venv/bin/auto-cpufreq
```

Monitor:

```bash
sudo auto-cpufreq --stats
```

### Memory (zram + swappiness)

zram is enabled with swappiness tuned for performance. Check current values:

```bash
cat /proc/sys/vm/swappiness
swapon --show
```

---

## 🔗 Symlinks (Stow)

If using GNU Stow to manage symlinks:

```bash
cd ~/dotfiles
stow config
```

---

## 🎨 Theming

Supports all 4 Catppuccin flavours: **Mocha**, **Macchiato**, **Frappe**, **Latte**.

Wlogout icons are available in all flavours and accent colours.

---

## 📝 Notes

- Hyprland config is split into modular files under `hyprland/config.d/`
- Waybar modules are separated into `modules.json` for cleaner config management
- Spotify runs via EasyRPM with `ELECTRON_OZONE_PLATFORM_HINT=wayland`
- ProtonVPN runs via Flatpak
