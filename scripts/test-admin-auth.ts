/**
 * Test Admin Authentication
 *
 * This script tests if the super admin users can access the admin dashboard
 * Run with: npx tsx scripts/test-admin-auth.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication...\n')

  // Test super admin users
  const superAdmins = [
    'boobalan.a@jkkn.ac.in',
    'sangeetha_v@jkkn.ac.in'
  ]

  for (const email of superAdmins) {
    console.log(`\n📧 Testing: ${email}`)
    console.log('─'.repeat(50))

    // Fetch profile from auth.users to get the ID
    const { data: authUser, error: authError } = await supabase
      .from('profiles')
      .select('id, email, role_type, status, full_name')
      .eq('email', email)
      .maybeSingle()

    if (authError) {
      console.error('❌ Error fetching user:', authError.message)
      continue
    }

    if (!authUser) {
      console.error('❌ User not found in profiles table')
      continue
    }

    console.log('✅ User found in profiles:')
    console.log('   ID:', authUser.id)
    console.log('   Name:', authUser.full_name)
    console.log('   Role Type:', authUser.role_type)
    console.log('   Status:', authUser.status)

    // Check if role_type is super_admin
    if (authUser.role_type === 'super_admin' && authUser.status === 'active') {
      console.log('✅ User should have admin access')
    } else {
      console.log('❌ User does NOT have admin access')
      console.log('   Expected: role_type="super_admin", status="active"')
      console.log('   Got: role_type="' + authUser.role_type + '", status="' + authUser.status + '"')
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Test completed!')
  console.log('\nNext steps:')
  console.log('1. Try logging in with one of the super admin accounts')
  console.log('2. Navigate to /admin/dashboard')
  console.log('3. Check the browser console and terminal logs for [MIDDLEWARE] messages')
  console.log('4. If you see "Super admin access granted", authentication is working')
  console.log('5. If redirected to /auth/unauthorized, check the logs for the reason')
}

testAdminAuth()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
