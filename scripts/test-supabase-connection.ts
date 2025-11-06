/**
 * Supabase Connection Test Script
 * Purpose: Diagnose connection and RLS policy issues
 * Usage: Run with `npx tsx scripts/test-supabase-connection.ts`
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables manually from .env.local
try {
  const envPath = join(process.cwd(), '.env.local');
  const envFile = readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  console.error('Error loading .env.local file');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Test 1: Check environment variables
  console.log('✅ Step 1: Environment Variables');
  console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.log();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing required environment variables!');
    process.exit(1);
  }

  // Test 2: Create client with anon key
  console.log('✅ Step 2: Testing Anon Key Connection');
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 3: Check if profiles table exists
  console.log('✅ Step 3: Checking if profiles table exists');
  const { data: tablesData, error: tablesError } = await anonClient
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (tablesError) {
    console.error('❌ Error accessing profiles table:', tablesError);
    console.log('   This could mean:');
    console.log('   1. The table does not exist (run SQL migrations)');
    console.log('   2. RLS policies are blocking access (no authenticated user)');
    console.log('   3. Connection credentials are invalid');
  } else {
    console.log('✅ Profiles table exists!');
  }
  console.log();

  // Test 4: Try to fetch profiles (will fail if RLS blocks)
  console.log('✅ Step 4: Testing SELECT query with RLS');
  const { data: profilesData, error: profilesError } = await anonClient
    .from('profiles')
    .select('*')
    .limit(5);

  if (profilesError) {
    console.error('❌ Error fetching profiles:', profilesError);
    console.log('   This is likely due to Row Level Security (RLS) policies.');
    console.log('   You need to either:');
    console.log('   1. Sign in as an admin user');
    console.log('   2. Temporarily modify RLS policies for development');
    console.log('   3. Use the service_role key (only for server-side)');
  } else {
    console.log('✅ Successfully fetched profiles:');
    console.log(`   Found ${profilesData?.length || 0} profiles`);
    if (profilesData && profilesData.length > 0) {
      profilesData.forEach((profile: any) => {
        console.log(`   - ${profile.email} (${profile.role})`);
      });
    }
  }
  console.log();

  // Test 5: If service role key is available, test with it
  if (SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ Step 5: Testing Service Role Key (bypasses RLS)');
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: serviceData, error: serviceError, count } = await serviceClient
      .from('profiles')
      .select('*', { count: 'exact' });

    if (serviceError) {
      console.error('❌ Error with service role:', serviceError);
    } else {
      console.log('✅ Service role access works!');
      console.log(`   Total profiles in database: ${count || 0}`);
      if (serviceData && serviceData.length > 0) {
        console.log('   Profiles:');
        serviceData.forEach((profile: any) => {
          console.log(`   - ${profile.email} (${profile.role}, ${profile.status})`);
        });
      } else {
        console.log('   ⚠️  No profiles found. You need to create users!');
      }
    }
    console.log();
  }

  // Test 6: Check RLS policies
  console.log('✅ Step 6: Summary & Next Steps');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (profilesError) {
    console.log('⚠️  RLS policies are blocking access');
    console.log();
    console.log('📋 To fix this, choose ONE of the following:');
    console.log();
    console.log('OPTION 1: Create an Admin User (Recommended)');
    console.log('  1. Go to: https://app.supabase.com/project/_/auth/users');
    console.log('  2. Click "Add User"');
    console.log('  3. Email: admin@jkkn.edu.in');
    console.log('  4. Set a password and check "Auto Confirm User"');
    console.log('  5. Run: supabase/setup/09_create_test_admin.sql');
    console.log('  6. Sign in with these credentials in your app');
    console.log();
    console.log('OPTION 2: Temporarily Disable RLS (Development Only)');
    console.log('  1. Run: supabase/setup/10_temp_dev_policies.sql');
    console.log('  2. This allows all authenticated users to access data');
    console.log('  ⚠️  WARNING: Never use in production!');
    console.log();
    console.log('OPTION 3: Use Service Role Key (Server-side only)');
    console.log('  - Modify your service to use service_role key');
    console.log('  - Only use on server-side/API routes, never client-side');
  } else {
    console.log('✅ Everything looks good!');
    console.log('   Your Supabase connection is working properly.');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Run the test
testConnection().catch(console.error);
