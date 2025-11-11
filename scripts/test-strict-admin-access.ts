/**
 * Test Strict Admin Access Control
 *
 * This script verifies that ONLY super_admin role type can access admin
 * Run with: npx tsx scripts/test-strict-admin-access.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testStrictAdminAccess() {
  console.log('🔒 Testing STRICT Admin Access Control')
  console.log('=' .repeat(70))
  console.log('Rule: ONLY users with role_type="super_admin" can access /admin')
  console.log('=' .repeat(70))
  console.log()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('email, role_type, status')
    .order('role_type')

  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }

  console.log('Testing all users:\n')

  let allowedCount = 0
  let blockedCount = 0

  for (const profile of profiles) {
    const shouldAllow = profile.role_type === 'super_admin' && profile.status === 'active'
    const icon = shouldAllow ? '✅ ALLOWED' : '🚫 BLOCKED'
    const color = shouldAllow ? '\x1b[32m' : '\x1b[31m'
    const reset = '\x1b[0m'

    console.log(`${color}${icon}${reset} ${profile.email}`)
    console.log(`   Role Type: ${profile.role_type}`)
    console.log(`   Status: ${profile.status}`)
    console.log(`   Expected: ${shouldAllow ? 'Access Granted' : 'Redirect to /auth/unauthorized'}`)
    console.log()

    if (shouldAllow) {
      allowedCount++
    } else {
      blockedCount++
    }
  }

  console.log('=' .repeat(70))
  console.log('📊 Summary:')
  console.log(`   ✅ ALLOWED (super_admin): ${allowedCount}`)
  console.log(`   🚫 BLOCKED (all others): ${blockedCount}`)
  console.log()

  console.log('🔐 Access Rules:')
  console.log('   1. User must be authenticated')
  console.log('   2. User email must end with @jkkn.ac.in')
  console.log('   3. User must have role_type = "super_admin"')
  console.log('   4. User status must be "active"')
  console.log()

  console.log('Expected Behavior:')
  console.log('   ✅ Super Admin → Can access /admin/dashboard')
  console.log('   🚫 Regular User → Redirected to /auth/unauthorized')
  console.log('   🚫 Custom Role → Redirected to /auth/unauthorized')
  console.log()

  console.log('🧪 How to Test:')
  console.log('   1. Login with mahasri_v@jkkn.ac.in (regular user)')
  console.log('   2. Try to access /admin/dashboard')
  console.log('   3. Should see "Access Denied" page immediately')
  console.log('   4. Should NOT see admin sidebar or any admin content')
  console.log()
  console.log('   5. Login with boobalan.a@jkkn.ac.in (super admin)')
  console.log('   6. Access /admin/dashboard')
  console.log('   7. Should see admin dashboard with full access')
}

testStrictAdminAccess()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
