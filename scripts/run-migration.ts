// =====================================================
// SQL MIGRATION RUNNER
// =====================================================
// Purpose: Run SQL migration files against Supabase
// Usage: npx tsx scripts/run-migration.ts <migration-file>
// =====================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile: string) {
  console.log(`Running migration: ${migrationFile}`);

  try {
    // Read the SQL file
    const sqlPath = join(process.cwd(), 'supabase', 'setup', migrationFile);
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('Executing SQL...');

    // Execute the SQL using the service role
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql function doesn't exist, try direct execution
      // This is for direct SQL execution via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ sql_query: sql }),
      });

      if (!response.ok) {
        console.error('Migration failed. You need to run this SQL manually in Supabase SQL Editor.');
        console.log('\nSQL to execute:');
        console.log('================');
        console.log(sql);
        console.log('================\n');
        console.log('Go to: https://app.supabase.com/project/_/sql');
        process.exit(1);
      }
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error running migration:', err);
    console.log('\nPlease run the SQL manually in Supabase SQL Editor:');
    console.log('https://app.supabase.com/project/_/sql');
    process.exit(1);
  }
}

// Get migration file from command line
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('Usage: npx tsx scripts/run-migration.ts <migration-file>');
  console.error('Example: npx tsx scripts/run-migration.ts 12_hero_sections_table.sql');
  process.exit(1);
}

runMigration(migrationFile);
