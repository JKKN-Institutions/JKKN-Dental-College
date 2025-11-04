# 📦 GitHub Push Guide - JKKN Dental College Project

**Your repository is already connected to:**
```
https://github.com/JKKN-Institutions/JKKN-Dental-College.git
```

---

## ✅ Security Check Complete

Your `.gitignore` file is properly configured! It will **NOT** push:

- ✅ `.env*.local` - Protects your Supabase credentials
- ✅ `node_modules/` - Dependencies (too large)
- ✅ `.next/` - Build cache
- ✅ `*.mp4, *.mov, *.avi` - Large video files
- ✅ `/public/videos/` - Video directory

**Your sensitive data is safe!** 🔒

---

## 🚀 Quick Push (Current Changes)

Since your repository is already set up, use these commands:

### Step 1: Add All Changes

```bash
git add .
```

### Step 2: Commit with Message

```bash
git commit -m "Add authentication system with separate user and admin tables"
```

**Or more detailed:**
```bash
git commit -m "Add authentication and database setup

- Separate user_profiles and admin_profiles tables
- Google OAuth integration
- Role-based access control (user/admin/super_admin)
- RLS policies and triggers
- Demo mode for UI preview
- Complete setup documentation
- Admin panel design implementation"
```

### Step 3: Push to GitHub

```bash
git push origin main
```

**That's it!** Your code is now on GitHub! 🎉

---

## 📋 Detailed Process (Step-by-Step)

### Check What Will Be Pushed

Before pushing, check what changes will be uploaded:

```bash
# See modified files
git status

# See detailed changes
git diff

# See untracked files
git ls-files --others --exclude-standard
```

### Stage Your Changes

**Option 1: Add all files**
```bash
git add .
```

**Option 2: Add specific files**
```bash
git add app/auth/callback/route.ts
git add middleware.ts
git add supabase/setup/*.sql
```

**Option 3: Add by pattern**
```bash
git add "*.md"  # Add all markdown files
git add "supabase/setup/*.sql"  # Add all SQL files
```

### Commit Your Changes

**Good commit messages:**

✅ **Clear and descriptive:**
```bash
git commit -m "Add separate user and admin profile tables"
```

✅ **With details:**
```bash
git commit -m "Implement authentication system

- Create user_profiles table for regular users
- Create admin_profiles table for admins
- Add RLS policies for both tables
- Implement Google OAuth flow
- Add middleware for role-based access control"
```

✅ **For bug fixes:**
```bash
git commit -m "Fix: Remove domain restriction from authentication"
```

✅ **For documentation:**
```bash
git commit -m "docs: Add complete setup guide and migration documentation"
```

❌ **Bad commit messages:**
```bash
git commit -m "update"  # Too vague
git commit -m "fixed stuff"  # Not descriptive
git commit -m "asdfasdf"  # Meaningless
```

### Push to GitHub

**Standard push:**
```bash
git push origin main
```

**First time push (if needed):**
```bash
git push -u origin main
```

**Force push (⚠️ USE WITH CAUTION):**
```bash
git push --force origin main
```
> ⚠️ Only use `--force` if you know what you're doing! It can overwrite remote history.

---

## 🔄 Common Git Workflows

### Daily Workflow

```bash
# 1. Check status
git status

# 2. Pull latest changes (if working with team)
git pull origin main

# 3. Make your changes
# ... edit files ...

# 4. Stage changes
git add .

# 5. Commit
git commit -m "Description of changes"

# 6. Push
git push origin main
```

### Before Making Changes

```bash
# Always pull latest first
git pull origin main

# Create a new branch (optional, for features)
git checkout -b feature/user-management

# Make changes...
# Commit...

# Push branch
git push origin feature/user-management
```

### Undo Changes

**Undo uncommitted changes:**
```bash
# Undo changes to a file
git checkout -- filename.ts

# Undo all uncommitted changes
git reset --hard HEAD
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```bash
git reset --hard HEAD~1
```

---

## 🔐 Security Best Practices

### Files That Should NEVER Be Pushed

Your `.gitignore` already blocks these:

- ✅ `.env.local` - Contains Supabase credentials
- ✅ `.env.production` - Production secrets
- ✅ `node_modules/` - Dependencies (install with npm)
- ✅ `.next/` - Build files (regenerated)

### Verify Before Pushing

**Check .env.local is ignored:**
```bash
git check-ignore .env.local
```
Should output: `.env.local` ✅

**Check what will be committed:**
```bash
git status
```
Should NOT show `.env.local` or `node_modules/` ✅

### If You Accidentally Pushed Secrets

**1. Remove from Git history:**
```bash
git rm --cached .env.local
git commit -m "Remove sensitive file"
git push origin main
```

**2. Rotate credentials immediately:**
- Go to Supabase Dashboard
- Generate new API keys
- Update `.env.local` locally
- Never push the new keys!

**3. Consider using:**
- GitHub Secrets (for CI/CD)
- Environment variables in deployment platform (Vercel, etc.)

---

## 📂 Repository Structure

Your GitHub repository will contain:

```
JKKN-Dental-College/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin panel pages
│   ├── auth/                     # Authentication pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── admin/                    # Admin components
│   ├── ui/                       # UI components
│   └── [other components]
├── lib/                          # Utilities
│   └── supabase/                 # Supabase clients
├── public/                       # Static assets
│   └── images/                   # Images (videos excluded)
├── supabase/                     # Database setup
│   └── setup/                    # SQL migration files
├── .gitignore                    # Ignored files
├── .env.local.example            # Example env file
├── package.json                  # Dependencies
├── README.md                     # Project documentation
├── COMPLETE_SETUP_GUIDE.md       # Setup instructions
├── MIGRATION_*.md                # Migration docs
└── [other documentation]

NOT in repository (ignored):
├── .env.local                    # 🔒 SECRETS
├── node_modules/                 # Dependencies
├── .next/                        # Build cache
└── public/videos/                # Large files
```

---

## 🌐 After Pushing

### View on GitHub

1. Go to: https://github.com/JKKN-Institutions/JKKN-Dental-College
2. You should see your latest commit
3. Browse files and check documentation

### Set Up Repository Settings

**1. Add README Badge (optional):**
```markdown
# JKKN Dental College Website

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
```

**2. Add Topics/Tags:**
- nextjs
- react
- typescript
- supabase
- authentication
- admin-panel

**3. Protect main branch:**
- Settings → Branches
- Add branch protection rule for `main`
- Require pull request reviews (if team)

**4. Add Secrets (for CI/CD):**
- Settings → Secrets and variables → Actions
- Add: `NEXT_PUBLIC_SUPABASE_URL`
- Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Add: `SUPABASE_SERVICE_ROLE_KEY`

---

## 👥 Working With a Team

### Pull Before You Push

Always get latest changes first:
```bash
git pull origin main
```

### Resolve Conflicts

If you get conflicts:
```bash
# 1. Pull changes
git pull origin main

# 2. Git will mark conflicts in files
# Edit files and resolve manually

# 3. Stage resolved files
git add .

# 4. Complete merge
git commit -m "Merge branch 'main'"

# 5. Push
git push origin main
```

### Use Branches for Features

```bash
# Create feature branch
git checkout -b feature/user-management

# Make changes and commit
git add .
git commit -m "Add user management interface"

# Push branch
git push origin feature/user-management

# Create Pull Request on GitHub
# After review and approval, merge to main
```

---

## 🚨 Troubleshooting

### "Permission denied" error

**Solution 1: Use HTTPS with token**
```bash
# Use personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/JKKN-Institutions/JKKN-Dental-College.git
```

**Solution 2: Use SSH**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@jkkn.ac.in"

# Add to GitHub: Settings → SSH Keys
# Change remote to SSH
git remote set-url origin git@github.com:JKKN-Institutions/JKKN-Dental-College.git
```

### "Failed to push" error

**Solution: Pull first**
```bash
git pull origin main
git push origin main
```

### Accidentally committed large files

**Solution: Remove from history**
```bash
# Remove file from git
git rm --cached path/to/large-file.mp4

# Commit removal
git commit -m "Remove large file"

# Push
git push origin main
```

### Wrong commit message

**Solution: Amend last commit**
```bash
git commit --amend -m "Correct commit message"
git push --force origin main  # ⚠️ Use carefully
```

---

## 📝 Commit Message Conventions

Follow these conventions for better project history:

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples

```bash
git commit -m "feat: Add user profile editing interface"
git commit -m "fix: Resolve authentication redirect loop"
git commit -m "docs: Update setup guide with troubleshooting section"
git commit -m "refactor: Simplify admin dashboard queries"
git commit -m "chore: Update dependencies to latest versions"
```

---

## 🎯 Quick Reference

| Command | What it does |
|---------|-------------|
| `git status` | Show current changes |
| `git add .` | Stage all changes |
| `git add filename` | Stage specific file |
| `git commit -m "message"` | Commit staged changes |
| `git push origin main` | Push to GitHub |
| `git pull origin main` | Get latest from GitHub |
| `git log --oneline` | View commit history |
| `git diff` | Show changes |
| `git branch` | List branches |
| `git checkout -b name` | Create new branch |

---

## ✅ Pre-Push Checklist

Before pushing to GitHub:

- [ ] `.env.local` is in `.gitignore` ✅
- [ ] No credentials in code
- [ ] No large video files (use `.gitignore`)
- [ ] Code tested locally
- [ ] Documentation updated
- [ ] Commit message is descriptive
- [ ] Pulled latest changes (`git pull`)

---

## 🎉 You're Ready to Push!

**Quick steps:**

```bash
# 1. Add all changes
git add .

# 2. Commit with message
git commit -m "Add authentication and database setup with admin panel"

# 3. Push to GitHub
git push origin main
```

**Your code is now on GitHub!** 🚀

View it at: https://github.com/JKKN-Institutions/JKKN-Dental-College

---

## 📚 Additional Resources

- **GitHub Docs:** https://docs.github.com
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Learn Git Branching:** https://learngitbranching.js.org/

---

**Questions?** Check the troubleshooting section above or run `git help <command>` for detailed help.
