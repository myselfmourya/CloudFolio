#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=========================================================="
echo "   Starting CloudFolio Student Portfolio Application...   "
echo "=========================================================="
echo ""
echo "Project Directory: $DIR"
echo ""

# Free port 3000 if occupied
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
  echo "Freeing port 3000..."
  kill -9 $PID 2>/dev/null
  sleep 1
fi

# Automatically open browser
(sleep 2 && open "http://localhost:3000") &

echo "Starting server at http://localhost:3000..."
echo "Your browser will open automatically in 2 seconds!"
echo ""
echo "(To stop, close this terminal window or double-click STOP-CLOUDFOLIO.command)"
echo "=========================================================="
echo ""

npx next start -p 3000
