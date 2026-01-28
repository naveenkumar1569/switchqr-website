const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'switchqr.db'));

console.log('Running migration: Add plan fields to users table...');

try {
    // Check if plan column already exists
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasPlanColumn = tableInfo.some(col => col.name === 'plan');

    if (!hasPlanColumn) {
        // Add plan column with default 'free'
        db.prepare("ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'starter', 'pro'))").run();
        console.log('✓ Added plan column');

        // Add plan_expires_at column
        db.prepare("ALTER TABLE users ADD COLUMN plan_expires_at DATETIME").run();
        console.log('✓ Added plan_expires_at column');

        // Set all existing users to 'free' plan
        const result = db.prepare("UPDATE users SET plan = 'free' WHERE plan IS NULL").run();
        console.log(`✓ Updated ${result.changes} existing users to 'free' plan`);
    } else {
        console.log('✓ Plan columns already exist, skipping migration');
    }

    console.log('Migration completed successfully!');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}

db.close();
