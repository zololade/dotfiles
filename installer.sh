#!/bin/bash

echo "Refreshing repositories..."
sudo zypper ref

echo "Installing Hyprland core, plugins, and Wayland essentials..."
sudo zypper install -y \
    hyprland \
    hyprland-bash-completion \
    hyprland-devel \
    hyprland-plugin-hyprbars \
    hyprland-plugin-hyprexpo \
    hyprland-plugin-hyprfocus \
    hyprland-protocols-devel \
    hyprland-qt-support \
    hyprland-qtutils \
    hyprland-wallpapers \
    hyprlock \
    hyprpicker \
    hyprpolkitagent \
    hyprsunset \
    hyprtoolkit-devel \
    hyprwayland-scanner \
    hyprcursor \
    hypridle \
    waybar \
    rofi-wayland \
    slurp \
    grim \
    wl-clipboard \
    xdg-desktop-portal-hyprland \
    xdg-desktop-portal-gtk

echo "Installing fonts..."
sudo zypper install -y \
    rozynski-comic-neue-fonts \
    nerd-fira-code-fonts \
    nerdfonts-JetBrainsMono \
    nerdfonts-Monaspace \
    google-noto-fonts \
    google-noto-serif-fonts 

echo "Installing system utilities..."
sudo zypper install -y \
    zram-generator \
    wlogout \
    thermald \
    awww \
    SwayNotificationCenter \
    NetworkManager \
    NetworkManager-applet \
    brightnessctl \
    cliphist \
    blueman \
    fastfetch \
    btop \
    pavucontrol \
    playerctl

echo "Installing dev tools..."
sudo zypper install -y \
    neovim \
    docker \
    docker-compose \
    git \
    gcc-c++

echo "Installing multimedia / UX tools..."
sudo zypper install -y \
    uxplay \
    gstreamer-plugins-good-extra \
    gstreamer-plugins-bad \
    gstreamer-plugins-ugly \
    gstreamer-plugins-vaapi \
    gstreamer-plugins-libav

echo "Enabling Docker services..."
sudo systemctl enable --now docker
sudo usermod -aG docker $USER

echo "-------------------------------------------------------"
echo "Installation complete! Log out and select Hyprland at the login screen."
echo "-------------------------------------------------------"