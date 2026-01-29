const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkOwner() {
    const qrId = 24;
    console.log(`Checking Owner for QR ${qrId}...`);

    // 1. Get QR Owner
    const { data: qr, error } = await supabase
        .from('qrs')
        .select('id, name, owner_id')
        .eq('id', qrId)
        .single();

    if (error) {
        console.error('QR Lookup Error:', error);
        return;
    }
    console.log('QR Info:', qr);

    // 2. List Users (to confirm existence)
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('User List Error:', userError);
        return;
    }

    const owner = users.find(u => u.id === qr.owner_id);
    if (owner) {
        console.log('✅ Owner Found in Auth Users:', owner.email, `(${owner.id})`);
    } else {
        console.error('❌ Owner ID NOT found in Auth Users! (Orphaned QR?)');
        console.log('Available Users:', users.map(u => `${u.email} (${u.id})`));
    }
}

checkOwner();
