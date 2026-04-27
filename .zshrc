# 1. Enable Zsh completion system
autoload -Uz compinit zsh/complist
compinit

# 2. Source shared configuration
[ -f "$HOME/.shared.sh" ] && . "$HOME/.shared.sh"
alias reload='source ~/.zshrc'

# 3. Load NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 4. Starship init (shell-specific)
eval "$(starship init zsh)"

# 5. Plugins
source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
