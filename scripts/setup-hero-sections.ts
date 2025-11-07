// =====================================================
// HERO SECTIONS TABLE SETUP GUIDE
// =====================================================
// Purpose: Guide for setting up hero_sections table
// Usage: npx tsx scripts/setup-hero-sections.ts
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  // Read environment variables directly
  const supabaseUrl = 'https://htpanlaslzowmnemyobc.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0cGFubGFzbHpvd21uZW15b2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNjAyNzEsImV4cCI6MjA3NzczNjI3MX0.SZdGvhRbc3lmLSFLGcnysnzfd3gYEKx7YtdeSIR8h30';

  console.log('=====================================================');
  console.log('HERO SECTIONS TABLE SETUP');
  console.log('=====================================================\n');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`✓ Supabase URL: ${supabaseUrl}\n`);

  // Read the SQL file
  const sqlPath = join(process.cwd(), 'supabase', 'setup', '12_hero_sections_table.sql');
  console.log(`Reading SQL file: ${sqlPath}`);

  try {
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('\n=====================================================');
    console.log('INSTRUCTIONS');
    console.log('=====================================================\n');
    console.log('To create the hero_sections table, follow these steps:\n');
    console.log('1. Go to your Supabase Dashboard SQL Editor:');
    console.log(`   https://app.supabase.com/project/htpanlaslzowmnemyobc/sql/new\n`);
    console.log('2. Copy the SQL below and paste it into the SQL Editor\n');
    console.log('3. Click "Run" to execute the SQL\n');
    console.log('=====================================================');
    console.log('SQL TO EXECUTE:');
    console.log('=====================================================\n');
    console.log(sql);
    console.log('\n=====================================================\n');

    // Try to check if table exists
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Checking if table exists...\n');

    const { data, error } = await supabase
      .from('hero_sections')
      .select('count')
      .limit(0);

    if (error) {
      if (error.message.includes('relation "public.hero_sections" does not exist')) {
        console.log('❌ Table does not exist yet. Please run the SQL above.');
      } else {
        console.log('❌ Error checking table:', error.message);
        console.log('   This might be an RLS issue. Please run the SQL above.');
      }
    } else {
      console.log('✓ Table exists! Checking for data...\n');

      const { data: rows, error: selectError } = await supabase
        .from('hero_sections')
        .select('*');

      if (selectError) {
        console.log('⚠️  Table exists but cannot read data:', selectError.message);
        console.log('   This is likely an RLS policy issue.');
        console.log('   Make sure the table has proper RLS policies for public access.');
      } else {
        console.log(`✓ Table is working! Found ${rows?.length || 0} hero sections.`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
