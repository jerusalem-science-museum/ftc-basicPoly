#!/bin/bash

# --- Startup environment setup ---
# Source profile/bashrc to get full PATH (needed for node, npm, pm2, etc.)
export HOME="${HOME:-/home/$(whoami)}"
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc"
[ -f "$HOME/.profile" ] && source "$HOME/.profile"

# If node is managed by nvm, load it
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

# Wait for network (loopback) to be ready
echo "Waiting for network..."
for i in $(seq 1 15); do
  ping -c 1 127.0.0.1 &>/dev/null && break
  sleep 1
done

# Log the environment for debugging
echo "PATH: $PATH"
echo "node: $(which node 2>/dev/null || echo 'NOT FOUND')"
echo "npm: $(which npm 2>/dev/null || echo 'NOT FOUND')"
echo "pm2: $(which pm2 2>/dev/null || echo 'NOT FOUND')"

SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

# Build only if dist doesn't exist or source files are newer than dist
if [ ! -d "dist" ] || [ "$(find src -newer dist -type f 2>/dev/null | head -1)" ]; then
  echo "Building for production..."
  npm run build
else
  echo "Skipping build, dist is up to date."
fi

echo "Starting production server with PM2..."
pm2 delete ftc-app 2>/dev/null
pm2 start npm --name "ftc-app" -- start
pm2 save

# Wait for server to be ready (up to 30 seconds)
echo "Waiting for server on port 8080..."
for i in $(seq 1 30); do
  if command -v curl &>/dev/null; then
    curl -s -o /dev/null http://localhost:8080 2>/dev/null && echo "Server is ready after ${i}s." && break
  else
    # Fallback: check if port is open via bash tcp
    (echo > /dev/tcp/localhost/8080) 2>/dev/null && echo "Server is ready after ${i}s." && break
  fi
  if [ "$i" -eq 30 ]; then
    echo "WARNING: Server not responding after 30s, launching browser anyway..."
  fi
  sleep 1
done

echo "Launching kiosk..."
chromium \
  --kiosk \
  --disable-restore-session-state \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --ignore-gpu-blocklist \
  --enable-gpu \
  --enable-webgl \
  --disable-features=MediaSessionService,HardwareMediaKeyHandling \
  --password-store=basic \
  --use-mock-keychain \
  "http://localhost:8080" 2>/dev/null &

echo "Done. Use 'pm2 logs ftc-app' to monitor."

