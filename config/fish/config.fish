if status is-interactive
    # Commands to run in interactive sessions can go here
end

# Nix environment setup
if test -e /home/ololade/.nix-profile/etc/profile.d/nix.fish
    source /home/ololade/.nix-profile/etc/profile.d/nix.fish
end

#starship
starship init fish | source

