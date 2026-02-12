const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function auditSupabase() {
    console.log('--- SUPABASE AUDIT ---');

    // 1. Check RLS on profiles
    const { data: policies, error: pError } = await supabase.rpc('get_policies', { table_name: 'profiles' });
    if (pError) {
        console.log('Could not fetch policies via RPC, trying manual check...');
        // Usually we can't fetch policies directly via JS client without RPC, 
        // but we can test it by trying to read as a non-admin.
    } else {
        console.log('Policies on profiles:', policies);
    }

    // 2. Check for the specific user
    const targetEmail = 'trialtest@gmail.com';
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
    const user = authUser.users.find(u => u.email === targetEmail);

    if (!user) {
        console.log(`User ${targetEmail} not found in Auth`);
    } else {
        console.log(`User ${targetEmail} found:`, user.id);

        // Check profile
        const { data: profile, error: profError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profError) {
            console.log('Profile error:', profError.message);
        } else {
            console.log('Current Profile in DB:', profile);
        }
    }

    // 3. List all profiles to see patterns
    const { data: allProfiles } = await supabase.from('profiles').select('*').limit(10);
    console.log('Pattern check (first 10 profiles):', allProfiles.map(p => ({ email: p.email, plan: p.plan, expires: p.plan_expires_at })));
}

auditSupabase();
