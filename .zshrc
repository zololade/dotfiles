# 1. Enable Zsh completion system
autoload -Uz compinit zsh/complist
compinit

# 2. Load Starship (Modified for Zsh)
# Your bashrc had 'starship init bash', this must be 'zsh'
eval "$(starship init zsh)"

# 3. NVM (Node Version Manager)
export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Zsh uses its own completion system, so the bash_completion line is usually not needed, 
# but keeping it won't hurt.

# 3. Environment Variables (Same as Bash)
export QT_QPA_PLATFORMTHEME=qt6ct
export QEMU_AUDIO_DRV=pa

# 4. PATH Updates
export PATH="$PATH:$HOME/Desktop"
export PATH="/opt/auto-cpufreq/venv/bin:$PATH"

# 5. Rust/Cargo Environment
. "$HOME/.cargo/env"

# 6. Load the official openSUSE-installed plugins
source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh


# 7. Legacy Alias file (If you use it)
test -s ~/.alias && . ~/.alias || true

#misc
export PATH=$PATH:~/Android/Sdk/platform-tools
