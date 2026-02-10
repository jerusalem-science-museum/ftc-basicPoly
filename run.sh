#!/bin/bash
cd ~/Documents/ftc-basicPoly
echo "Starting dev server..."
nohup npm run dev > dev.log 2>&1 &
DEVPID=$!
sleep 5
echo "Launching kiosk..."
PORT=${1:-8081}  # Use arg or default 3000
firefox --kiosk "http://172.22.2.77:8080 " &
wait $DEVPID  # Optional: wait for dev to finish

