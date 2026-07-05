# Shared shell configuration (aliases, environment variables, functions)

# === ENVIRONMENT VARIABLES ===
export EDITOR='nvim'
export VISUAL='nvim'
export QT_QPA_PLATFORMTHEME=qt6ct
export QEMU_AUDIO_DRV=pa
export NVM_DIR="$HOME/.nvm"

# === PATH ===
# Standard paths
export PATH="$HOME/.local/bin:$HOME/.local/bin/scripts:$PATH"

# Project/Tool specific paths
export PATH="/opt/auto-cpufreq/venv/bin:$PATH"
export PATH="$PATH:$HOME/Android/Sdk/platform-tools"
export PATH="$HOME/.opencode/bin:$PATH"

# === ALIASES ===
alias ls='ls --color=auto'
alias ll='ls -lh'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph --decorate'

# System
alias reload='source ~/.bashrc' # Default, will be overridden in zshrc
alias update='paru -Syu'

# === FUNCTIONS ===
function mkd() {
    mkdir -p "$1" && cd "$1"
}

# === STARSHIP CONFIG ===
if command -v starship >/dev/null 2>&1; then
    export STARSHIP_CONFIG="$HOME/.config/starship.toml"
fi

# === CARGO ===
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"
