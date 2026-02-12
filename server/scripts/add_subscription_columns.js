const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addColumns() {
    console.log('--- ADDING SUBSCRIPTION COLUMNS ---');

    const sql = `
    ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS subscription_id text DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS current_period_end timestamptz DEFAULT NULL;
    
    -- Optional: Index on status for faster lookups
    CREATE INDEX IF NOT EXISTS idx_profiles_sub_status ON public.profiles(subscription_status);
    `;

    console.log('SQL to Run:');
    console.log(sql);

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        console.error('RPC Error (Expected if function missing):', error.message);
        console.log('\nACTION REQUIRED: Please run the SQL above in your Supabase SQL Editor.');
    } else {
        console.log('Success! Columns added via RPC.');
    }
}

addColumns();
