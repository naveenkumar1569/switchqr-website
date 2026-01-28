const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const { initDb } = require('./database');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database
initDb();

const authRoutes = require('./routes/auth');
const qrRoutes = require('./routes/qrs');
const redirectRoutes = require('./routes/redirect');
const usersRoutes = require('./routes/users');
const planRoutes = require('./routes/plan');
const campaignsRoutes = require('./routes/campaigns');
const variantsRoutes = require('./routes/variants');
const schedulesRoutes = require('./routes/schedules');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/qrs', qrRoutes);
app.use('/api/stats', require('./routes/analytics'));
app.use('/api/users', usersRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/qrs', variantsRoutes); // Variants are under /api/qrs/:id/variants
app.use('/api/qrs', schedulesRoutes); // Schedules are under /api/qrs/:id/schedules

// Redirect Service (Must be last to avoid capturing api routes if not mounted carefully, but here we mount at root)
// Ideally, api routes are under /api, so this captures everything else unless we mount it differently.
// For now, let's mount it at root but ensure it doesn't conflict.
app.use('/', redirectRoutes);

// Routes
app.get('/', (req, res) => {
    res.send('SwitchQR API is running');
});

// Start Server
app.listen(PORT, () => {
    logger.info('Server started', { port: PORT, environment: process.env.NODE_ENV || 'development' });
});
