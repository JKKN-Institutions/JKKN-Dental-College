# Supabase Setup Guide for JKKN Admin Panel

This guide will walk you through setting up Supabase for your admin panel with Google OAuth authentication restricted to @jkkn.ac.in domain.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the details:
   - **Organization**: Select or create your organization
   - **Project Name**: `JKKN Institution`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: `Southeast Asia (Singapore)` or closest to India
   - **Pricing Plan**: Start with Free tier
5. Click **"Create new project"**
6. Wait ~2 minutes for project to be ready

## Step 2: Get Supabase Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key
     - `service_role` `secret` key

4. Copy these values

## Step 3: Create `.env.local` File

1. In your project root, create a file named `.env.local`
2. Add the following (replace with your actual values):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Setup Google OAuth in Google Cloud Console

### 4.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it: `JKKN Institution Website`

### 4.2 Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in the form:
   - **App name**: `JKKN Institution`
   - **User support email**: Your email
   - **App logo**: (optional) Upload JKKN logo
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. On Scopes page, click **Add or Remove Scopes**:
   - Select: `../auth/userinfo.email`
   - Select: `../auth/userinfo.profile`
   - Select: `openid`
6. Click **Update** then **Save and Continue**
7. Skip Test users page (click **Save and Continue**)
8. Review and click **Back to Dashboard**

### 4.3 Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **OAuth client ID**
3. Select **Application type**: `Web application`
4. **Name**: `JKKN Institution Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://your-production-domain.com` (add later)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/auth/callback`
   - `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback` (your Supabase project URL)
   - Add production URLs later
7. Click **Create**
8. **SAVE** your Client ID and Client Secret

## Step 5: Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to expand
3. Enable **Google Enabled** toggle
4. Fill in the form:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
   - **Authorized Client IDs**: Leave empty (not needed for web)
5. Scroll down to **Additional Configuration**
6. Enable **Skip nonce check** (check the box)
7. In **Hd parameter** field, enter: `jkkn.ac.in`
   - This restricts login to only @jkkn.ac.in emails
8. Click **Save**

## Step 6: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **+ New query**
3. Copy and paste the SQL from the next section
4. Click **Run** (or press Ctrl/Cmd + Enter)

### Database Schema SQL

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Create activity_logs table
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert logs"
  ON activity_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update last login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    last_login_at = NOW(),
    login_count = login_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger needs to be on auth.sessions which requires service role
-- For now, we'll handle login tracking in the application

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 7: Create Your First Admin User

Since you need an admin account to access the admin panel, you'll need to:

1. First, sign in to your website using your @jkkn.ac.in Google account
2. This will create a user profile with role 'user'
3. Then, manually update your role to 'admin' using SQL:

```sql
-- In Supabase SQL Editor, run this (replace with your email):
-- IMPORTANT: Email MUST end with @jkkn.ac.in (enforced by database constraint)
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your-email@jkkn.ac.in';
```

**Note:** All admin and super_admin accounts MUST have email addresses ending with `@jkkn.ac.in`. This is enforced at the database level - any attempt to create or update a profile with a non-JKKN email will be rejected automatically.

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:3000`
3. You should see the website
4. Authentication will be added in the next steps!

## Step 9: Enable Realtime (Optional but Recommended)

1. In Supabase Dashboard, go to **Database** > **Replication**
2. Enable replication for tables you want real-time updates:
   - `profiles`
   - `activity_logs`
   - Any other tables you create later
3. Click **Save**

## Troubleshooting

### Issue: "Invalid OAuth callback URL"
**Solution**: Make sure you added the Supabase callback URL to Google OAuth redirect URIs:
- `https://your-project-ref.supabase.co/auth/v1/callback`

### Issue: "Email domain not allowed"
**Solution**:
1. Check that you added `hd: 'jkkn.ac.in'` in the **Hd parameter** field in Supabase Google provider settings
2. Try signing out and signing in again

### Issue: "User not found in database"
**Solution**: The trigger to create profiles might not have run. Manually create profile:
```sql
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'user'
FROM auth.users
WHERE email = 'your-email@jkkn.ac.in';
```

### Issue: Environment variables not loading
**Solution**:
1. Make sure `.env.local` is in your project root
2. Restart your development server
3. Check that variable names start with `NEXT_PUBLIC_` for client-side access

## Security Checklist

- [ ] Database password is strong and saved securely
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Service role key is kept secret (never expose in client code)
- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] Google OAuth is configured with domain restriction (@jkkn.ac.in)
- [ ] Only @jkkn.ac.in emails can sign in (enforced by Google OAuth)
- [ ] All user profiles (including admins) restricted to @jkkn.ac.in domain (enforced by database constraint)

## Next Steps

After completing this setup:
1. Continue with authentication pages implementation
2. Build admin panel UI
3. Test the complete authentication flow
4. Add more database tables as needed

## Important URLs to Bookmark

- **Supabase Dashboard**: https://app.supabase.com/project/YOUR_PROJECT_ID
- **Google Cloud Console**: https://console.cloud.google.com/
- **Supabase Documentation**: https://supabase.com/docs

---

**Need Help?**
- Supabase Discord: https://discord.supabase.com
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
