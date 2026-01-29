const Database = require('better-sqlite3');
const path = require('path');
const logger = require('./utils/logger');

const db = new Database(path.join(__dirname, 'switchqr.db'));

// Initialize Database Schema
const initDb = () => {
    const schema = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'starter', 'pro')),
            plan_expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS qrs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            campaign_id INTEGER,
            name TEXT,
            destination_url TEXT NOT NULL,
            short_code TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'active', -- active, paused
            ab_testing_enabled BOOLEAN DEFAULT 0,
            scheduling_enabled BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
        );

        CREATE TABLE IF NOT EXISTS qr_variants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr_id INTEGER NOT NULL,
            destination_url TEXT NOT NULL,
            weight INTEGER NOT NULL DEFAULT 50,
            label TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (qr_id) REFERENCES qrs(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS qr_schedule_rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr_id INTEGER NOT NULL,
            destination_url TEXT NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME,
            label TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (qr_id) REFERENCES qrs(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr_id INTEGER NOT NULL,
            variant_id INTEGER,
            schedule_rule_id INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip TEXT,
            user_agent TEXT,
            device_type TEXT,
            os TEXT,
            country TEXT,
            city TEXT,
            referrer TEXT,
            FOREIGN KEY (qr_id) REFERENCES qrs(id),
            FOREIGN KEY (variant_id) REFERENCES qr_variants(id),
            FOREIGN KEY (schedule_rule_id) REFERENCES qr_schedule_rules(id)
        );
    `;

    db.exec(schema);

    // Auto-migration for missing columns
    try {
        const migrations = [
            "ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'starter', 'pro'))",
            "ALTER TABLE users ADD COLUMN plan_expires_at DATETIME",
            "ALTER TABLE qrs ADD COLUMN status TEXT DEFAULT 'active'",
            "ALTER TABLE qrs ADD COLUMN ab_testing_enabled BOOLEAN DEFAULT 0",
            "ALTER TABLE qrs ADD COLUMN scheduling_enabled BOOLEAN DEFAULT 0",
            "ALTER TABLE qr_schedule_rules ADD COLUMN recurrence_type TEXT DEFAULT 'once'",
            "ALTER TABLE qr_schedule_rules ADD COLUMN recurrence_days TEXT",
            "ALTER TABLE qr_schedule_rules ADD COLUMN recurrence_end_date TEXT"
        ];

        migrations.forEach(sql => {
            try {
                db.prepare(sql).run();
                logger.info('Applied migration', { sql });
            } catch (e) {
                // Ignore duplicate column errors
                if (!e.message.includes('duplicate column')) {
                    logger.debug('Migration note', { message: e.message });
                }
            }
        });
    } catch (error) {
        logger.error('Migration error', { error: error.message });
    }

    logger.info('Database initialized successfully');
};

module.exports = { db, initDb };
