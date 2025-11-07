// =====================================================
// HERO SECTIONS TABLE DIAGNOSTIC SCRIPT
// =====================================================
// Purpose: Test if hero_sections table exists and is accessible
// Usage: npx tsx scripts/test-hero-sections-table.ts
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables manually
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

async function testHeroSectionsTable() {
  console.log('🎬 Testing Hero Sections Table...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check environment variables
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials!');
    console.error('   Check your .env.local file');
    process.exit(1);
  }

  console.log('✅ Environment Variables');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Anon Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...`);
  console.log(`   Service Key: ${SUPABASE_SERVICE_ROLE_KEY ? '✅ Available' : '❌ Not set'}\n`);

  // Test 1: Check with Anon Key (like the frontend does)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Checking with Anon Key (Frontend Simulation)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data, error, count } = await anonClient
      .from('hero_sections')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('❌ Error with Anon Key:', error.message);
      console.error('   Error Code:', error.code || 'N/A');
      console.error('   Error Details:', JSON.stringify(error, null, 2));

      if (error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
        console.log('\n📋 DIAGNOSIS: Table does not exist');
        console.log('   → You need to create the hero_sections table\n');
      } else if (Object.keys(error).length === 0 || error.code === 'PGRST301') {
        console.log('\n📋 DIAGNOSIS: RLS policy blocking access');
        console.log('   → Table exists, but RLS policies are preventing access\n');
      }
    } else {
      console.log('✅ Success! Table is accessible with Anon Key');
      console.log(`   Found ${count || 0} hero sections`);
      if (data && data.length > 0) {
        console.log('\n   Hero Sections:');
        data.forEach((hero: any) => {
          console.log(`   - ${hero.title} (${hero.is_active ? 'Active' : 'Inactive'})`);
        });
      } else {
        console.log('   (No hero sections in database yet)');
      }
    }
  } catch (err: any) {
    console.error('❌ Network Error:', err.message);
    console.log('\n📋 DIAGNOSIS: Connection failed');
    console.log('   → Check your internet connection');
    console.log('   → Verify Supabase URL is correct');
    console.log('   → Verify Supabase project is running');
  }

  // Test 2: Check with Service Role Key (bypasses RLS)
  if (SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('TEST 2: Checking with Service Role Key (Bypasses RLS)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    try {
      const { data, error, count } = await serviceClient
        .from('hero_sections')
        .select('*', { count: 'exact' });

      if (error) {
        console.error('❌ Error with Service Role Key:', error.message);
        console.error('   Error Code:', error.code || 'N/A');

        if (error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
          console.log('\n📋 CONFIRMED: Table does NOT exist in database');
          console.log('   Even service role cannot access it.\n');
        }
      } else {
        console.log('✅ Success! Table exists and is accessible');
        console.log(`   Total hero sections: ${count || 0}`);
        if (data && data.length > 0) {
          console.log('\n   All Hero Sections:');
          data.forEach((hero: any) => {
            console.log(`   - ${hero.title}`);
            console.log(`     Status: ${hero.is_active ? '🟢 Active' : '⚪ Inactive'}`);
            console.log(`     Created: ${new Date(hero.created_at).toLocaleDateString()}`);
          });
        }
      }
    } catch (err: any) {
      console.error('❌ Network Error:', err.message);
    }
  }

  // Summary and Next Steps
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUMMARY & NEXT STEPS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🎯 TO FIX THE ERRORS:\n');
  console.log('1️⃣  Open Supabase SQL Editor:');
  console.log('   https://app.supabase.com/project/htpanlaslzowmnemyobc/sql/new\n');

  console.log('2️⃣  Copy the SQL from this file:');
  console.log('   supabase/setup/QUICK_SETUP_hero_sections.sql\n');

  console.log('3️⃣  Paste and click "Run"\n');

  console.log('4️⃣  Restart your Next.js dev server:\n');
  console.log('   npm run dev\n');

  console.log('5️⃣  Navigate to:');
  console.log('   http://localhost:3000/admin/content/hero-sections\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testHeroSectionsTable().catch(console.error);
