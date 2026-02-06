/**
 * Script to upgrade a user to Pro plan in Supabase
 * Usage: node scripts/upgrade_to_pro.js <email>
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const email = process.argv[2];

if (!email) {
    console.error('❌ Error: Email required');
    console.log('Usage: node scripts/upgrade_to_pro.js <email>');
    process.exit(1);
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

async function upgradeToPro() {
    try {
        console.log(`🔍 Looking for user: ${email}...`);

        // Get user by email from Supabase Auth
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            console.error('❌ Error listing users:', listError);
            process.exit(1);
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            console.error(`❌ User not found: ${email}`);
            console.log('\nAvailable users:');
            users.forEach(u => console.log(`  - ${u.email} (${u.id})`));
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

        // Check if user profile exists in profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('❌ Error checking profile:', profileError);
            process.exit(1);
        }

        if (!profile) {
            // Create profile with Pro plan
            console.log('📝 Creating new profile with Pro plan...');
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    plan: 'pro'
                });

            if (insertError) {
                console.error('❌ Error creating profile:', insertError);
                process.exit(1);
            }
        } else {
            // Update existing profile to Pro
            console.log(`📝 Updating profile from "${profile.plan || 'free'}" to "pro"...`);
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ plan: 'pro' })
                .eq('id', user.id);

            if (updateError) {
                console.error('❌ Error updating profile:', updateError);
                process.exit(1);
            }
        }

        console.log('✅ Successfully upgraded to Pro plan!');
        console.log('\n🎉 User can now access all Pro features:');
        console.log('  - Unlimited QR codes');
        console.log('  - A/B Testing');
        console.log('  - Scheduling');
        console.log('  - Campaigns');
        console.log('  - Custom branding');
        console.log('  - Advanced analytics');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

upgradeToPro();
