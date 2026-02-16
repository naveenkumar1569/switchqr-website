#!/bin/bash
# Script to safely remove console.log statements while preserving console.error/warn
# This targets debug console.log statements in server routes

BACKUP_DIR="/Users/naveen-4684/Desktop/SwitchQR/backup_before_cleanup"
mkdir -p "$BACKUP_DIR"

echo "Creating backups..."
cp -r /Users/naveen-4684/Desktop/SwitchQR/server/routes "$BACKUP_DIR/routes_backup"

echo "Removing console.log statements (preserving console.error/warn)..."

# List of files to clean
FILES=(
    /Users/naveen-4684/Desktop/SwitchQR/server/routes/auth.supabase.js
    /Users/naveen-4684/Desktop/SwitchQR/server/routes/schedules.js
    /Users/naveen-4684/Desktop/SwitchQR/server/routes/schedules.supabase.js
    /Users/naveen-4684/Desktop/SwitchQR/server/routes/variants.supabase.js
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        # Remove lines containing ONLY console.log (with optional whitespace/semicolons)
        sed -i.bak '/^[[:space:]]*console\.log/d' "$file"
        # Clean up backup files created by sed
        rm -f "${file}.bak"
    fi
done

echo "✅ Cleanup complete. Backups stored in: $BACKUP_DIR"
