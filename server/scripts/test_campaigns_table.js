
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testTable() {
    console.log('Testing campaigns status column...');
    const { data, error } = await supabase
        .from('campaigns')
        .insert({
            name: 'Test Campaign ' + Date.now(),
            description: 'Schema Test',
            // We assume owner_id is not strictly foreign-key checked or we use a dummy UUID if strict
            // Actually, we need a valid owner_id if RLS is on or FK is strict. 
            // We'll trust the user has at least one user or RLS allows insert if we have a valid token (which we don't here, only Anon key).
            // Wait, RLS will block Anon insert usually.
            // Let's just try to SELECT the 'status' column specifically.
        })
        .select('status')
        .limit(1);

    // Better approach: Select 'status' from campaigns
    // If column doesn't exist, Supabase will return error 42703 (undefined_column).
    const { error: selectError } = await supabase
        .from('campaigns')
        .select('status')
        .limit(1);

    if (selectError) {
        if (selectError.code === '42703') {
            console.log('❌ Column "status" DOES NOT exist.');
        } else {
            console.error('❌ Error accessing table:', selectError);
        }
    } else {
        console.log('✅ Column "status" EXISTS.');
    }
}

testTable();
