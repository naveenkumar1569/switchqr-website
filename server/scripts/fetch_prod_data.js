const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runVerification() {
    console.log('\n--- Step 3: Profile Query ---');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, paddle_customer_id, subscription_id, subscription_status, plan, current_period_end')
        .eq('email', 'naveenkumar085@gmail.com')
        .maybeSingle();

    if (profileError) console.error('Profile Error:', profileError);
    else console.log(JSON.stringify(profile, null, 2));

    console.log('\n--- Step 4: Transactions Query ---');
    const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('id, user_id, subscription_id, amount_minor, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

    if (txError) console.error('Transaction Error:', txError);
    else console.log(JSON.stringify(transactions, null, 2));
}

runVerification();
