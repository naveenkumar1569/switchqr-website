#!/bin/bash
# Production Cleanup Script
# Finds and reports console.log statements for manual review

echo "🔍 Scanning for console.log statements..."
echo "============================================"

# Find all console.log in client and server (exclude node_modules, scripts, and smoke_tests)
grep -r "console.log" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude=smoke_tests.js \
  /Users/naveen-4684/Desktop/SwitchQR/client/src \
  /Users/naveen-4684/Desktop/SwitchQR/server/routes \
  /Users/naveen-4684/Desktop/SwitchQR/server/middleware \
  /Users/naveen-4684/Desktop/SwitchQR/server/utils \
  | grep -v "//" \
  | wc -l

echo ""
echo "Files with console.log:"
grep -r "console.log" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude=smoke_tests.js \
  /Users/naveen-4684/Desktop/SwitchQR/client/src \
  /Users/naveen-4684/Desktop/SwitchQR/server/routes \
  /Users/naveen-4684/Desktop/SwitchQR/server/middleware \
  /Users/naveen-4684/Desktop/SwitchQR/server/utils \
  | cut -d: -f1 \
  | sort -u

echo ""
echo "✅ Scan complete"
