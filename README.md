# dotfiles

Personal dotfiles for my Hyprland setup on **openSUSE Tumbleweed**.

---

## 🖥️ System

|           |                     |
| --------- | ------------------- |
| **OS**    | openSUSE Tumbleweed |
| **WM**    | Hyprland            |
| **Shell** | bash + Starship     |
| **Theme** | Catppuccin Mocha    |

---

## 📦 Components

| Component                  | Tool                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| Compositor                 | Hyprland                                                              |
| Bar                        | Waybar                                                                |
| Launcher                   | Rofi                                                                  |
| Notifications              | Dunst / swaync                                                        |
| Lock screen                | Hyprlock                                                              |
| Idle daemon                | Hypridle                                                              |
| Logout menu                | Wlogout                                                               |
| Clipboard history          | cliphist                                                              |
| Wayland clipboard utility  | wl-clipboard                                                          |
| Network manager            | NetworkManager-applet                                                 |
| Polkit agent               | hyprpolkit                                                            |
| AirPlay receiver           | uxplay                                                                |
| Editor                     | Zed / VSCode                                                          |
| Terminal                   | Kitty                                                                 |
| System monitor             | btop                                                                  |
| CPU optimization           | auto-cpufreq                                                          |
| Thermal management         | thermald                                                              |
| Memory optimization        | zram + swappiness tuning                                              |
| Wallpaper manager          | awww                                                                  |
| Theme (GTK, icons, cursor) | Catppuccin (Mocha)                                                    |
| Fonts                      | JetBrains Mono, Fira Code, Monaspace (all Nerd Font variants)         |

---

## OpenSUSE Tumbleweed component installation

run `./installer.sh` to install all dependencies and set up the system for the dotfiles configuration.

## 📁 Dotfiles Structure

```bash
.config/
├── hyprland/
├── waybar/
├── kitty/
├── rofi/
├── swaync/
├── wlogout/
├── nvim/
└── systemd/user/
```

---

## ⚙️ Dotfiles Setup (npm)

```bash
git clone https://github.com/zololade/dotfiles.git ~/dotfiles
cd ~/dotfiles

node ./setup.js  
or  
npm run setup  # creates symlinks & manages user services

or npm link  # run this in the repo directory for global usage of setup script then run
dots-install # from anywhere to execute the setup script
```

The Node.js setup script (`setup.js`) will:

* Automatically create required directories
* Create symlinks in `~/.config` and `~/.local/bin`
* Detect and skip correct symlinks
* Replace broken or incorrect symlinks
* Backup existing files (`*_bak_TIMESTAMP`)
* Handle nested paths (e.g. `systemd/user`)
* Reload systemd and enable user services

---

## ⚙️ System Setup

### CPU Optimization (auto-cpufreq)

```bash
sudo systemctl mask power-profiles-daemon
sudo systemctl mask cpupower

git clone https://github.com/AdnanHodzic/auto-cpufreq.git
cd auto-cpufreq && sudo ./auto-cpufreq-installer

sudo auto-cpufreq --install
```

### Memory Optimization (zram + swappiness)

```bash
cat /proc/sys/vm/swappiness
swapon --show
```

---

## 🎨 Theming

Uses **Catppuccin (Mocha)** across:

* GTK
* Terminal
* Waybar
* Rofi
* Wlogout

---

## 📝 Notes

* Hyprland config is modular (`config.d/`)
* Waybar modules are separated for readability
* Systemd user services are managed via dotfiles
* Designed for reproducible setup on fresh installs
* Symlinks + scripts managed via `setup.js`

---

## 📦 Requirements

* Node.js >= 18
* Git
* systemd (user services enabled)
* Hyprland and related components installed
* Optional: auto-cpufreq for CPU optimization
* Optional: zram and swappiness tuning for memory optimization
