import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubuekuqlwaqbsyrlbrfz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidWVrdXFsd2FxYnN5cmxicmZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzE2NTc5OSwiZXhwIjoyMTAyNzQxNzk5fQ.AHfASm6L85mFb2GBim7lmngVFCx0AH59znxDASQ6A5s';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('🚀 Starting demo accounts setup for Supabase...');

  const users = [
    {
      email: 'admin@demo.com',
      password: 'demo123456',
      role: 'admin',
      name: 'Demo Admin',
      student_id: 'CSE0001',
    },
    {
      email: 'user@demo.com',
      password: 'demo123456',
      role: 'approved_user',
      name: 'Demo Contributor',
      student_id: 'CSE0002',
    },
  ];

  for (const u of users) {
    console.log(`\nProcessing ${u.email}...`);

    // 1. Check if user already exists
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existing = listData?.users?.find((x) => x.email === u.email);

    if (existing) {
      console.log(`  Deleting existing user ${u.email} (${existing.id}) to ensure fresh credentials...`);
      await supabase.auth.admin.deleteUser(existing.id);
    }

    // 2. Create user with admin API (this properly generates auth.users + auth.identities)
    console.log(`  Creating user ${u.email}...`);
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        name: u.name,
        student_id: u.student_id,
      },
    });

    if (createError) {
      console.error(`  ❌ Error creating ${u.email}:`, createError.message);
      continue;
    }

    const userId = createData.user.id;
    console.log(`  ✅ User created successfully! (ID: ${userId})`);

    // 3. Upsert user_profiles record with approved status and correct role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        name: u.name,
        email: u.email,
        student_id: u.student_id,
        role: u.role,
        status: 'approved',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error(`  ❌ Error updating profile for ${u.email}:`, profileError.message);
    } else {
      console.log(`  ✅ Profile assigned role: "${u.role}" and status: "approved"`);
    }
  }

  // 4. Verification: Test sign-in with anon client
  console.log('\n🔍 Verifying login for both accounts...');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidWVrdXFsd2FxYnN5cmxicmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNjU3OTksImV4cCI6MjEwMjc0MTc5OX0.j0ti1mULKFYpb8xWNNndQu0YHo2t0Ig5rmgSIBFNnSM';
  const client = createClient(supabaseUrl, anonKey);

  for (const u of users) {
    const { data, error } = await client.auth.signInWithPassword({
      email: u.email,
      password: u.password,
    });

    if (error) {
      console.error(`❌ Login test failed for ${u.email}:`, error.message);
    } else {
      console.log(`🎉 Login test SUCCESS for ${u.email} (UID: ${data.user.id})!`);
    }
  }

  console.log('\n✨ All demo users are completely set up and verified!');
}

main().catch(console.error);
