const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

// We need two clients: one admin to fix things, one anon to test RLS
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixRLS() {
    console.log('--- FIXING SUPABASE RLS ---');

    // 1. Enable RLS on profiles if not active
    // Note: We use SQL via RPC if available, or just assume we need to apply policies
    // Since we can't run arbitrary SQL easily without a specific RPC, we'll try to use a common one if it exists
    // or just report that we need it.

    const sql = `
    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Policy: Users can see their own profile
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

    -- Policy: Users can update their own profile
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

    -- Policy: Service role can do everything (usually default, but let's be safe)
    DROP POLICY IF EXISTS "Service role full access" ON public.profiles;
    CREATE POLICY "Service role full access" ON public.profiles
    USING (true)
    WITH CHECK (true);
    `;

    console.log('Suggested SQL to run in Supabase SQL Editor:');
    console.log(sql);

    // Let's try to check if we can run it via an RPC if the user has one like 'exec_sql'
    // Usually they don't by default for security, but let's check.
    const { data: rpcTest, error: rpcError } = await supabaseAdmin.rpc('exec_sql', { sql_query: 'SELECT 1' });
    if (rpcError) {
        console.log('RPC "exec_sql" not found. Manual intervention required OR use Admin Client in backend.');
    } else {
        console.log('RPC "exec_sql" found! Running fix...');
        await supabaseAdmin.rpc('exec_sql', { sql_query: sql });
    }
}

fixRLS();
