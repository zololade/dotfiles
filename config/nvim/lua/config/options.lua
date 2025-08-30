-- Options are automatically loaded before lazy.nvim startup
-- Default options that are always set: https://github.com/LazyVim/LazyVim/blob/main/lua/lazyvim/config/options.lua
-- Add any additional options here
vim.opt.mouse = "a"

-- Disable scroll wheel entirely
vim.keymap.set("", "<ScrollWheelUp>", "<Nop>", { silent = true })
vim.keymap.set("", "<ScrollWheelDown>", "<Nop>", { silent = true })
vim.keymap.set("", "<S-ScrollWheelUp>", "<Nop>", { silent = true })
vim.keymap.set("", "<S-ScrollWheelDown>", "<Nop>", { silent = true })
vim.keymap.set("", "<C-ScrollWheelUp>", "<Nop>", { silent = true })
vim.keymap.set("", "<C-ScrollWheelDown>", "<Nop>", { silent = true })
