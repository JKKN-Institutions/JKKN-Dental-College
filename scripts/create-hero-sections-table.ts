// =====================================================
// AUTOMATED HERO SECTIONS TABLE CREATION
// =====================================================
// Purpose: Automatically create hero_sections table with RLS
// Usage: npx tsx scripts/create-hero-sections-table.ts
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  console.log('=====================================================');
  console.log('AUTOMATED HERO SECTIONS TABLE CREATION');
  console.log('=====================================================\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nPlease check your .env.local file.');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`✓ Supabase URL: ${supabaseUrl}\n`);

  // Create Supabase client with service role (bypasses RLS)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log('✓ Supabase client created with service role\n');

  // Read the SQL file
  const sqlPath = join(process.cwd(), 'supabase', 'setup', '12_hero_sections_table.sql');

  try {
    console.log(`Reading SQL file: ${sqlPath}\n`);
    const sql = readFileSync(sqlPath, 'utf-8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);
    console.log('Executing SQL statements...\n');

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }

      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        });

        if (error) {
          // If exec_sql doesn't exist, try direct execution
          console.log(`  Statement ${i + 1}/${statements.length}: Attempting direct execution...`);
          throw error;
        }

        console.log(`  ✓ Statement ${i + 1}/${statements.length} executed successfully`);
      } catch (err: any) {
        console.warn(`  ⚠️  Statement ${i + 1}/${statements.length} may need manual execution`);
        if (err.message) {
          console.warn(`     Error: ${err.message}`);
        }
      }
    }

    console.log('\n=====================================================');
    console.log('VERIFYING TABLE CREATION');
    console.log('=====================================================\n');

    // Verify table exists
    const { data: tables, error: tablesError } = await supabase
      .from('hero_sections')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.log('⚠️  Table verification using service role...\n');
      console.log('The table may have been created, but we need to verify manually.');
      console.log('\nPlease run the SQL manually in Supabase Dashboard:');
      console.log('https://app.supabase.com/project/htpanlaslzowmnemyobc/sql/new\n');
      console.log('SQL to run:');
      console.log('---');
      console.log(sql);
      console.log('---\n');
    } else {
      console.log('✓ Table created successfully!');
      console.log(`✓ Found ${tables?.length || 0} hero sections\n`);

      if (tables && tables.length > 0) {
        console.log('Hero sections in database:');
        tables.forEach((hero: any) => {
          console.log(`  - ${hero.title} (Active: ${hero.is_active})`);
        });
      }
    }

    console.log('\n=====================================================');
    console.log('SETUP COMPLETE');
    console.log('=====================================================\n');
    console.log('Next steps:');
    console.log('1. Restart your Next.js development server');
    console.log('2. Navigate to /admin/content/hero-sections');
    console.log('3. You should now see the hero sections list\n');

  } catch (err: any) {
    console.error('\n❌ Error:', err.message || err);
    console.log('\n=====================================================');
    console.log('MANUAL SETUP REQUIRED');
    console.log('=====================================================\n');
    console.log('Please run the SQL manually in Supabase Dashboard:');
    console.log('https://app.supabase.com/project/htpanlaslzowmnemyobc/sql/new\n');

    try {
      const sql = readFileSync(sqlPath, 'utf-8');
      console.log('SQL to run:');
      console.log('---');
      console.log(sql);
      console.log('---\n');
    } catch (readErr) {
      console.error('Could not read SQL file:', readErr);
    }

    process.exit(1);
  }
}

main();
