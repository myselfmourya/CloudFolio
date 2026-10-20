#!/bin/bash
echo "=========================================================="
echo "          Stopping CloudFolio Web Application...          "
echo "=========================================================="
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
  kill -9 $PID 2>/dev/null
  echo "✓ CloudFolio has been stopped cleanly (terminated PID: $PID)."
else
  echo "✓ No server was running on port 3000."
fi
echo "=========================================================="
sleep 2
