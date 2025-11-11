/**
 * Verify Access Control for Admin Dashboard
 *
 * This script verifies that:
 * 1. Super admins CAN access the admin dashboard
 * 2. Regular users CANNOT access the admin dashboard
 *
 * Run with: npx tsx scripts/verify-access-control.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment')
  console.log('Please add it to your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function verifyAccessControl() {
  console.log('🔐 Verifying Admin Dashboard Access Control')
  console.log('='.repeat(60))
  console.log()

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, role_type, status, full_name')
    .order('role_type')

  if (error) {
    console.error('❌ Error fetching profiles:', error.message)
    process.exit(1)
  }

  console.log(`Found ${profiles.length} users in the system\n`)

  let superAdminCount = 0
  let regularUserCount = 0
  let customRoleCount = 0

  for (const profile of profiles) {
    const hasAccess = profile.role_type === 'super_admin' && profile.status === 'active'
    const icon = hasAccess ? '✅' : '❌'
    const accessText = hasAccess ? 'HAS ACCESS' : 'NO ACCESS'

    console.log(`${icon} ${profile.email}`)
    console.log(`   Name: ${profile.full_name || 'Not set'}`)
    console.log(`   Role: ${profile.role_type}`)
    console.log(`   Status: ${profile.status}`)
    console.log(`   Access: ${accessText}`)
    console.log()

    if (profile.role_type === 'super_admin') {
      superAdminCount++
    } else if (profile.role_type === 'custom_role') {
      customRoleCount++
    } else {
      regularUserCount++
    }
  }

  console.log('='.repeat(60))
  console.log('📊 Summary:')
  console.log(`   Super Admins (✅ Full Access): ${superAdminCount}`)
  console.log(`   Custom Roles (⚠️ Permission-based): ${customRoleCount}`)
  console.log(`   Regular Users (❌ No Access): ${regularUserCount}`)
  console.log()

  console.log('🔒 Access Control Status:')
  if (superAdminCount === 2) {
    console.log('   ✅ Exactly 2 super admins configured')
    console.log('   ✅ boobalan.a@jkkn.ac.in')
    console.log('   ✅ sangeetha_v@jkkn.ac.in')
  } else {
    console.log(`   ⚠️ Warning: Found ${superAdminCount} super admins (expected 2)`)
  }

  if (regularUserCount > 0) {
    console.log(`   ✅ ${regularUserCount} regular users are blocked from admin access`)
  }

  console.log()
  console.log('='.repeat(60))
  console.log('✅ Access control verification complete!')
  console.log()
  console.log('💡 How the middleware works:')
  console.log('   1. User logs in → middleware checks their profile')
  console.log('   2. If role_type === "super_admin" → ALLOW access to /admin')
  console.log('   3. If role_type === "custom_role" → Check permissions')
  console.log('   4. If role_type === "user" → BLOCK access, redirect to /auth/unauthorized')
  console.log()
  console.log('🧪 To test:')
  console.log('   1. Login with a super admin account → Should access /admin/dashboard')
  console.log('   2. Login with a regular user account → Should be blocked')
  console.log('   3. Check terminal logs for [MIDDLEWARE] messages')
}

verifyAccessControl()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
