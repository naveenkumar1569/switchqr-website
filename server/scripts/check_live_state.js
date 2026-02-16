const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const TARGET_EMAIL = 'naveenkumar085@gmail.com';

async function checkState() {
    console.log(`\n--- Checking State for ${TARGET_EMAIL} ---`);

    // Profile
    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('id, email, plan, subscription_status, subscription_id, current_period_end, paddle_customer_id')
        .eq('email', TARGET_EMAIL)
        .maybeSingle();

    if (pError) console.error('Error fetching profile:', pError.message);
    else console.log('Current Profile:', profile);

    // Recent Transactions
    const { data: transactions, error: tError } = await supabase
        .from('transactions')
        .select('id, user_id, subscription_id, amount_minor, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

    if (tError) console.error('Error fetching transactions:', tError.message);
    else console.log('Recent Transactions:', transactions);
}

checkState();
