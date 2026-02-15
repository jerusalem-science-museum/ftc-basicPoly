#!/bin/bash
cd ~/Documents/ftc-basicPoly

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

sleep 3

echo "Launching kiosk..."
chromium \
  --kiosk \
  --disable-restore-session-state \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --disable-features=MediaSessionService,HardwareMediaKeyHandling \
  --password-store=basic \
  --use-mock-keychain \
  "http://localhost:8080" 2>/dev/null &

echo "Done. Use 'pm2 logs ftc-app' to monitor."

