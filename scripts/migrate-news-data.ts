/**
 * Migration Script: Add existing news items to database
 * Run this once to populate the college_news table with existing hardcoded news
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseKey);

const existingNewsItems = [
  {
    title: 'JKKN Receives NAAC A+ Accreditation',
    description:
      'Our institution has been awarded NAAC A+ accreditation, recognizing our commitment to quality education and excellence in all aspects of academic delivery.',
    image_url: '/images/jkkn institution.jpeg',
    published_date: '2025-01-15',
    is_active: true,
    display_order: 1,
  },
  {
    title: 'Students Win National Level Hackathon',
    description:
      'JKKN students secured first place in the national hackathon, showcasing innovation and technical prowess.',
    image_url: '/images/achievement image.jpeg',
    published_date: '2025-01-10',
    is_active: true,
    display_order: 2,
  },
  {
    title: 'New Research Lab Inaugurated',
    description:
      'State-of-the-art research laboratory with cutting-edge equipment inaugurated to enhance research capabilities.',
    image_url: '/images/college infrastructure.jpeg',
    published_date: '2025-01-05',
    is_active: true,
    display_order: 3,
  },
  {
    title: 'Record Breaking Placement Season 2024-25',
    description:
      '95% placement rate achieved with top companies offering excellent packages to our talented students.',
    image_url: '/images/placement image.jpeg',
    published_date: '2024-12-28',
    is_active: true,
    display_order: 4,
  },
  {
    title: 'Faculty Receives National Teaching Award',
    description:
      'Dr. Sarah Johnson honored with the prestigious National Teaching Excellence Award for outstanding contribution to education.',
    image_url: '/images/achievement image.jpeg',
    published_date: '2024-12-20',
    is_active: true,
    display_order: 5,
  },
  {
    title: 'MoU Signed with Leading Tech Companies',
    description:
      'Strategic partnerships established with industry leaders to provide better opportunities for our students.',
    image_url: '/images/college infrastructure.jpeg',
    published_date: '2024-12-15',
    is_active: true,
    display_order: 6,
  },
];

async function migrateNewsData() {
  console.log('Starting news data migration...');

  try {
    // Check if news items already exist
    const { data: existingData, error: checkError } = await supabase
      .from('college_news')
      .select('id');

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log(`Found ${existingData.length} existing news items. Skipping migration.`);
      console.log('If you want to re-run this migration, delete existing news items first.');
      return;
    }

    // Insert news items
    const { data, error } = await supabase
      .from('college_news')
      .insert(existingNewsItems)
      .select();

    if (error) {
      console.error('Error inserting news items:', error);
      return;
    }

    console.log(`Successfully migrated ${data?.length} news items!`);
    console.log('News items:', data);
  } catch (error) {
    console.error('Unexpected error during migration:', error);
  }
}

// Run the migration
migrateNewsData();
