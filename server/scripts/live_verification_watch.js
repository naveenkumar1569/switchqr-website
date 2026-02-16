const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const TARGET_EMAIL = 'naveenkumar085@gmail.com';

async function monitor() {
    console.log(`\n=== MONITORING SUPABASE FOR ${TARGET_EMAIL} ===`);
    console.log('Press Ctrl+C to stop.\n');

    let lastProfile = null;
    let lastTxCount = 0;

    // Initial check
    const { count } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
    lastTxCount = count || 0;

    setInterval(async () => {
        // Check Profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, plan, subscription_status, subscription_id, current_period_end, paddle_customer_id')
            .eq('email', TARGET_EMAIL)
            .single();

        const currentProfileStr = JSON.stringify(profile);
        if (lastProfile && lastProfile !== currentProfileStr) {
            console.log('\n[UPDATE DETECTED] Profile changed!');
            console.log('New State:', profile);
        }
        lastProfile = currentProfileStr;

        // Check Transactions
        const { count: currentTxCount, data: newTxns } = await supabase
            .from('transactions')
            .select('id, amount_minor, status, created_at')
            .order('created_at', { ascending: false })
            .limit(1); // Just check latest

        if (currentTxCount > lastTxCount) {
            console.log('\n[UPDATE DETECTED] New Transaction!');
            console.log('Transaction:', newTxns[0]);
            lastTxCount = currentTxCount;
        }

    }, 2000);
}

monitor();
