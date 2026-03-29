# 🚨 URGENT: Credentials Rotation Required

## Summary
Your `.env.local` file contains exposed secrets that have been committed to this repository. These credentials **must be rotated immediately**. This document outlines what needs to be done.

## Exposed Credentials

| Service | Current Location | Action Required |
|---------|------------------|-----------------|
| **Better Auth Secret** | `BETTER_AUTH_SECRET` | ⚠️ Generate new secret immediately |
| **MongoDB Connection** | `MONGODB_URI` | ⚠️ Reset MongoDB password, update connection string |
| **Resend API Key** | `RESEND_API_KEY` | ⚠️ Revoke old key, generate new one |

## Risk Assessment

- **Severity**: 🔴 **CRITICAL** - All API keys and database credentials are exposed
- **Impact**: Anyone with access to this repo can:
  - Access your entire MongoDB database
  - Send emails on your behalf via Resend
  - Impersonate authenticated users via Better Auth
  - Modify user profiles and sensitive data

## Immediate Actions (Do Now)

### 1. Rotate Better Auth Secret
```bash
# Generate a new secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
- Copy the output
- Update `BETTER_AUTH_SECRET` in your .env.local
- Invalidate existing sessions (users will need to re-login)

### 2. Reset MongoDB Credentials
1. Log into MongoDB Atlas: https://cloud.mongodb.com
2. Go to **Database Access** → Find user **tambeaditya22_db_user**
3. Click **Edit** → Select **New Database Password**
4. Add the new password, copy it
5. Update `MONGODB_URI` with new password:
   ```
   MONGODB_URI=mongodb+srv://tambeaditya22_db_user:NEW_PASSWORD@cluster0.a1ffwhd.mongodb.net/propfusion
   ```

### 3. Revoke Resend API Key
1. Go to Resend Dashboard: https://resend.com/api-keys
2. Find the old key: `re_5ZZuaHap_3j4m4CbheciPDrKgzKgi6WHi`
3. Click **Revoke** (delete it)
4. Generate a new API key
5. Update `RESEND_API_KEY` in your .env.local

### 4. Generate New Anthropic API Key
1. Go to https://console.anthropic.com/
2. Generate a new API key (or use existing if not yet exposed)
3. Update `ANTHROPIC_API_KEY` in your .env.local

## Long-term Security (Do Next)

### .gitignore Configuration
Verify `.env.local` is in `.gitignore`. If this file got committed:

```bash
# Remove from git history (REQUIRES FORCE PUSH)
git rm --cached .env.local
git commit --amend --no-edit

# Or use git-filter-repo for complete removal
# (More aggressive, rewrites all history)
```

### Environment Variables in Production
- **Never** commit `.env.local` files
- Use platform-specific secret management:
  - **Vercel**: Project Settings → Environment Variables
  - **Docker**: Secrets management or orchestration tools
  - **Local**: `.env.local` (git-ignored)

### Best Practices Going Forward
1. ✅ Create `.env.example` with placeholder values (PROVIDED)
2. ✅ Add `.env.local` to `.gitignore`
3. ✅ Use per-environment secrets (dev, staging, prod)
4. ✅ Rotate credentials monthly
5. ✅ Use secret rotation automation (AWS Secrets Manager, Vault, etc.)

## Verification Checklist

- [ ] Generated new Better Auth secret
- [ ] Reset MongoDB password
- [ ] Revoked old Resend API key and generated new one
- [ ] Updated all credentials in `.env.local`
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Removed sensitive data from git history (if needed)
- [ ] Deployed with new credentials to staging/prod
- [ ] Tested all services with new credentials

## Files to Review/Update

- ✅ `.env.example` - Created with placeholder values
- Review: `.gitignore` - Ensure `.env.local` is excluded
- Review: `next.config.ts` - No credential leaks detected
- Review: `lib/auth/auth.ts` - No credential leaks detected

---

**Last Updated**: 2024
**Status**: 🔴 NOT COMPLETED - ACTION REQUIRED
