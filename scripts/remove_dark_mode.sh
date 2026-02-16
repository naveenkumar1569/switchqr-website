#!/bin/bash
# Script to remove all dark: prefixed Tailwind classes from React components
# This will significantly reduce file sizes and simplify the codebase

BACKUP_DIR="/Users/naveen-4684/Desktop/SwitchQR/backup_before_dark_mode_removal"
mkdir -p "$BACKUP_DIR"

echo "Creating backups..."
cp -r /Users/naveen-4684/Desktop/SwitchQR/client/src "$BACKUP_DIR/src_backup"

echo "Removing dark mode Tailwind classes..."

# Find all .jsx files and remove dark: classes
find /Users/naveen-4684/Desktop/SwitchQR/client/src -name "*.jsx" -type f | while read file; do
    echo "Processing: $file"
    # Remove dark: classes using sed
    # This matches patterns like: dark:text-white dark:bg-gray-800 etc.
    sed -i.bak 's/dark:[a-zA-Z0-9_\/-]*//g' "$file"
    # Clean up excessive whitespace left behind
    sed -i.bak 's/  \+/ /g' "$file"
    # Remove backup files
    rm -f "${file}.bak"
done

echo "✅ Dark mode removal complete. Backups stored in: $BACKUP_DIR"
echo "Files processed:"
find /Users/naveen-4684/Desktop/SwitchQR/client/src -name "*.jsx" -type f | wc -l
