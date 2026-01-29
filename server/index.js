const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Database mode: 'supabase' or 'sqlite' (for legacy/migration)
const DATABASE_MODE = (process.env.DATABASE_MODE || 'supabase').trim();
console.log(`[DEBUG] DATABASE_MODE resolved to: '${DATABASE_MODE}'`);

if (DATABASE_MODE === 'sqlite') {
    // Legacy SQLite initialization
    try {
        const { initDb } = require('./database');
        initDb();
        logger.info('Using SQLite database');
    } catch (e) {
        logger.error('Failed to init SQLite', { error: e.message });
    }
} else {
    // Supabase initialization (just validates env vars)
    require('./utils/supabase');
    logger.info('Using Supabase database');
}

// Auth routes
const authRoutes = require('./routes/auth.supabase');
// QR routes
const qrRoutes = require('./routes/qrs.supabase');
// Redirect routes
const redirectRoutes = require('./routes/redirect.supabase');
// Users routes
const usersRoutes = require('./routes/users.supabase');
// Plan routes
const planRoutes = require('./routes/plan.supabase');
// Analytics routes
const analyticsRoutes = require('./routes/analytics.supabase');
// Campaigns routes
const campaignsRoutes = require('./routes/campaigns.supabase');
// Variants
const variantsRoutes = require('./routes/variants.supabase');
// Schedules
const schedulesRoutes = require('./routes/schedules.supabase');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Debug Middleware: Log all requests
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/qrs', qrRoutes);
app.use('/api/stats', analyticsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/campaigns', campaignsRoutes); // TODO: Migrate
app.use('/api/qrs', variantsRoutes); // Variants are under /api/qrs/:id/variants
app.use('/api/qrs', schedulesRoutes); // Schedules are under /api/qrs/:id/schedules

// Redirect Service (Must be last to avoid capturing api routes)
app.use('/', redirectRoutes);

// Health Check Endpoint
app.get('/health', async (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database_mode: DATABASE_MODE
    };

    if (DATABASE_MODE === 'supabase') {
        const { healthCheck } = require('./utils/supabase');
        const dbHealth = await healthCheck();
        health.database = dbHealth;
        health.status = dbHealth.ok ? 'ok' : 'degraded';
    }

    res.status(health.status === 'ok' ? 200 : 503).json(health);
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('SwitchQR API is running');
});

// 404 Handler (Log unhandled routes)
app.use((req, res) => {
    console.error(`[404] Route not found: ${req.method} ${req.url}`);
    res.status(404).send(`Cannot GET ${req.url} (Explicit 404)`);
});

// Start Server
app.listen(PORT, () => {
    logger.info('Server started', { port: PORT, environment: process.env.NODE_ENV || 'development', database_mode: DATABASE_MODE });
});
