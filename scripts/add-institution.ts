/**
 * Manual script to add institutions to the database
 * Use this as a workaround until the correct API endpoint is found
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addInstitutions() {
  const institutions = [
    {
      institution_id: 'jkkn_001',
      name: 'JKKN Dental College',
      counselling_code: 'JKKN001',
      category: 'Dental',
      institution_type: 'College',
      is_active: true,
    },
    {
      institution_id: 'jkkn_002',
      name: 'JKKN Engineering College',
      counselling_code: 'JKKN002',
      category: 'Engineering',
      institution_type: 'College',
      is_active: true,
    },
    {
      institution_id: 'jkkn_003',
      name: 'JKKN Arts and Science College',
      counselling_code: 'JKKN003',
      category: 'Arts & Science',
      institution_type: 'College',
      is_active: true,
    },
  ]

  console.log('Inserting institutions...')

  const { data, error } = await supabase
    .from('institutions')
    .upsert(institutions, {
      onConflict: 'institution_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    console.error('Error inserting institutions:', error)
    process.exit(1)
  }

  console.log('Successfully inserted', data?.length || institutions.length, 'institutions')
  console.log(data)
}

addInstitutions()
