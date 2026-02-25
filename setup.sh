#!/bin/bash
#
# Setup script for ftc-basicPoly exhibit.
# Prerequisites: Linux Mint system set up via the museum wiki
#   https://github.com/jerusalem-science-museum/.github/wiki
#
# This script installs nvm, Node.js, pm2, project dependencies,
# configures pm2 startup, and sets run.sh to launch on login.

set -e

SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

echo "=== Installing nvm ==="
if [ ! -d "$HOME/.nvm" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
else
  echo "nvm already installed, skipping."
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

echo "=== Installing Node.js LTS ==="
nvm install --lts
nvm use --lts

echo "=== Installing pm2 globally ==="
npm install -g pm2

echo "=== Installing project dependencies ==="
npm install

echo "=== Configuring pm2 startup ==="
STARTUP_CMD=$(pm2 startup | grep "sudo" | tail -1)
if [ -n "$STARTUP_CMD" ]; then
  echo "Running: $STARTUP_CMD"
  eval "$STARTUP_CMD"
fi

echo "=== Setting up autostart ==="
AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"

RUN_SH="$(cd "$SCRIPT_DIR" && pwd)/run.sh"
chmod +x "$RUN_SH"

cat > "$AUTOSTART_DIR/ftc-basicPoly.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=FTC BasicPoly Exhibit
Exec=bash $RUN_SH
X-GNOME-Autostart-enabled=true
EOF

echo "=== Done! ==="
echo "Autostart entry created at $AUTOSTART_DIR/ftc-basicPoly.desktop"
echo "You can test by running: bash run.sh"
