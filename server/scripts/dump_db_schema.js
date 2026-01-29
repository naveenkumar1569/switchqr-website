const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function dumpSchema() {
    console.log('--- DB SCHEMA DUMP ---');
    try {
        // qrs info
        const { data: qrsCols, error: e1 } = await supabase.rpc('get_table_info', { table_name: 'qrs' });
        if (e1) {
            console.log('Trying alternative schema query for qrs...');
            const { data: qrsData, error: e1alt } = await supabase.from('qrs').select('*').limit(1);
            if (qrsData) console.log('qrs sample keys:', Object.keys(qrsData[0]));
        } else {
            console.log('qrs columns:', qrsCols);
        }

        // profiles info
        const { data: profData, error: e2 } = await supabase.from('profiles').select('*').limit(1);
        if (profData) console.log('profiles sample keys:', Object.keys(profData[0]));

        // schedules info
        const { data: schedData, error: e3 } = await supabase.from('schedules').select('*').limit(1);
        if (schedData) console.log('schedules sample keys:', Object.keys(schedData[0]));

        // variants info
        const { data: varData, error: e4 } = await supabase.from('variants').select('*').limit(1);
        if (varData) console.log('variants sample keys:', Object.keys(varData[0]));

    } catch (err) {
        console.error('Dump error:', err);
    }
}

dumpSchema();
