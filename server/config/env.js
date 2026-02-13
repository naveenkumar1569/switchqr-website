const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
    port: process.env.PORT || 5001,
    databaseMode: (process.env.DATABASE_MODE || 'supabase').trim(),
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.JWT_SECRET,
    paddleApiKey: process.env.PADDLE_API_KEY,
};

module.exports = config;
