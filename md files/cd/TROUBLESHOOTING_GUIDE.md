# 🆘 CI/CD Troubleshooting Guide

Common issues and solutions for the enterprise CI/CD pipeline.

## 🔍 Debugging Workflow Runs

### How to Access Logs

1. **GitHub UI Method:**
   - Go to: **Actions** tab
   - Click on the failed workflow
   - Click on the failed job
   - Expand the failed step
   - View the raw error message

2. **GitHub CLI Method:**
   ```bash
   # List recent runs
   gh run list --limit 10
   
   # View specific run
   gh run view <run-id> --log
   
   # Download all logs as zip
   gh run view <run-id> --log > output.log
   ```

3. **Search logs for errors:**
   ```bash
   # Look for specific error pattern
   grep -i "error" output.log | head -20
   ```

---

## 🚨 Common Issues & Solutions

### CI Pipeline Issues

#### ❌ Issue: "npm ERR! 404 Not Found"

**Symptoms:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/...
npm ERR! 404 It is not an optional dependency and will fail
```

**Causes:**
- Typo in package name in `package.json`
- Package doesn't exist on npm registry
- Network connectivity issue

**Solutions:**
```bash
# 1. Check package names locally
npm ls

# 2. Verify package exists
npm search your-package-name

# 3. Fix package.json
# Remove the problematic dependency

# 4. Clean lock file
rm package-lock.json
npm install

# 5. Push fix
git add package.json package-lock.json
git commit -m "fix: fix npm dependency"
git push origin main
```

---

#### ❌ Issue: "TypeScript Error: TS2339 Property X does not exist"

**Symptoms:**
```
error TS2339: Property 'X' does not exist on type 'Y'
```

**Causes:**
- Type mismatch between imported and used types
- Missing or incorrect type definitions
- API change in dependency

**Solutions:**
```bash
# 1. Run locally to debug
npm run typecheck

# 2. Check the specific file showing error
# Review imports and type definitions

# 3. Fix type issues:
# Option A: Add type definition
interface MyType {
  X: string;
}

# Option B: Use type assertion (last resort)
const obj = data as MyType;

# 4. Verify locally before pushing
npm run typecheck
npm run build
```

---

#### ❌ Issue: "ESLint Error: Unexpected var"

**Symptoms:**
```
error: Unexpected var  no-var
```

**Causes:**
- Using `var` instead of `let`/`const`
- Old code not following lint rules
- Lint config changed

**Solutions:**
```bash
# 1. Fix automatically with ESLint
npm run lint -- --fix

# 2. If still failing, manually fix:
# Change 'var' to 'const' or 'let'

# 3. Test locally
npm run lint

# 4. Commit and push
git add .
git commit -m "fix: resolve ESLint violations"
git push origin main
```

---

#### ❌ Issue: "Build failed: Cannot find module"

**Symptoms:**
```
Error: Cannot find module 'X'
```

**Causes:**
- Missing dependency installation
- Incorrect import path
- File was deleted

**Solutions:**
```bash
# 1. Check if module is installed
npm ls package-name

# 2. Install if missing
npm install package-name

# 3. Verify import path
# Check spelling and case sensitivity

# 4. Check if file exists
ls -la path/to/file

# 5. Rebuild lock file if needed
npm ci --legacy-peer-deps

# 6. Test locally
npm run build
```

---

#### ❌ Issue: "Build timeout (default 10 min exceeded)"

**Symptoms:**
```
The operation exceeded the time limit.
```

**Causes:**
- Build takes too long
- Network latency
- Insufficient cache

**Solutions:**
```bash
# 1. Optimize build locally
npm run build

# 2. Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build

# 3. Increase timeout in workflow
timeout-minutes: 20  # Increase from 10

# 4. Enable better caching
- uses: actions/cache@v4
  with:
    path: .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}

# 5. Consider code splitting optimization
# Split large components into smaller ones
```

---

### CD Pipeline Issues

#### ❌ Issue: "Deployment waiting forever at approval gate"

**Symptoms:**
```
Workflow pending at step "Approval"
No "Review deployments" button appears
```

**Causes:**
- No approvers assigned
- GitHub permission issue
- Environment not configured

**Solutions:**
```bash
# 1. Check environment settings
# Settings → Environments → production
# Verify approvers are listed

# 2. Add yourself as approver (temporary)
# Settings → Environments → production
# Add your GitHub username

# 3. Grant permissions
# Settings → Collaborators & teams
# Verify user has "Admin" or "Maintain" role

# 4. Manually trigger approval
# Go to: Actions → [workflow name] → pending deployment
# Click "Review deployments"
```

---

#### ❌ Issue: "Deployment failed: SSH permission denied"

**Symptoms:**
```
Permission denied (publickey)
fatal: Could not read from remote repository
```

**Causes:**
- SSH key not in authorized_keys on target
- SSH key format incorrect
- Wrong user/host combination

**Solutions:**
```bash
# 1. Test SSH connection locally
ssh -i ~/.ssh/deploy_key user@your-server.com

# 2. If fails, verify key on server
ssh user@your-server.com "cat ~/.ssh/authorized_keys"

# 3. Add public key to server
# Generate if not already done:
ssh-keygen -f deploy_key -N ""
# Copy public key to server:
ssh-copy-id -i deploy_key.pub user@your-server.com

# 4. Verify permissions on server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 5. Update GitHub secret
# Settings → Secrets → PRODUCTION_DEPLOY_KEY
# Paste the PRIVATE key (usually from deploy_key file)

# 6. Test deployment again
```

---

#### ❌ Issue: "Health check failed - endpoint returned 404"

**Symptoms:**
```
curl: (22) The requested URL returned error: 404
Health check failed after 10 retries
```

**Causes:**
- Health check endpoint doesn't exist
- Wrong URL in workflow
- App not fully started when check runs
- Firewall blocking request

**Solutions:**
```bash
# 1. Verify endpoint exists
curl http://localhost:3000/api/health
# Should return: { "status": "ok" }

# 2. Create endpoint if missing
# app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}

# 3. Check URL in workflow
# Make sure ${{ secrets.STAGING_URL }} is correct

# 4. Increase wait time before health check
# In workflow, adjust sleep duration:
- run: sleep 30  # Wait 30 seconds before checking

# 5. Debug endpoint on deployment target
ssh user@server
curl http://localhost:3000/api/health
```

---

#### ❌ Issue: "Automatic rollback triggered"

**Symptoms:**
```
Deployment succeeded but smoke tests failed
Automatic rollback initiated
```

**Causes:**
- Smoke tests failing post-deployment
- Health check endpoint unreachable
- Database migrations failed
- Critical functionality broken

**Solutions:**
```bash
# 1. Check smoke test errors
# Actions → [CD workflow] → smoke-tests-production job
# Review test output for specific failures

# 2. Verify what reverted
git log --oneline -5
# Should show rollback commit

# 3. Debug the actual issue
# What changed that broke the tests?
git diff HEAD~2 HEAD~1

# 4. Fix the issue
# Test locally before pushing
npm run build
npm run start
curl http://localhost:3000/api/health

# 5. Push fix
git add .
git commit -m "fix: resolve smoke test failures"
git push origin main
# CD will auto-trigger again

# 6. Manual deployment if needed
# Temporarily skip smoke tests in workflow
# Add: continue-on-error: true
# to smoke-tests-production job
```

---

### Security & Dependency Issues

#### ❌ Issue: "npm audit shows critical vulnerabilities"

**Symptoms:**
```
found X vulnerabilities (Y critical)
```

**Causes:**
- Outdated dependencies
- Known security issue in library
- Transitive dependency vulnerability

**Solutions:**
```bash
# 1. Check vulnerabilities detail
npm audit
npm audit --json > audit.json

# 2. Auto-fix if possible
npm audit fix

# 3. If npm audit fix doesn't work:
# Find the problematic package
npm ls vulnerable-package

# 4. Update that package
npm update vulnerable-package

# 5. If still failing, consider:
# - Different package with similar functionality
# - Wait for patch release
# - Pin version to one you know is safe

# 6. Test and commit
npm run build
git add package-lock.json
git commit -m "fix: resolve security vulnerabilities"
git push origin main
```

---

#### ❌ Issue: "License compliance warning"

**Symptoms:**
```
License check: Package X has GPL license (incompatible)
```

**Causes:**
- Dependency with restrictive license (GPL, AGPL)
- License compatibility conflict

**Solutions:**
```bash
# 1. Review all licenses
npm ls --all | grep -i gpl

# 2. Check license compatibility
# Your project license: MIT
# Conflicting dependency: GPL
# Are they compatible?

# 3. Options:
# Option A: Use alternative package with compatible license
npm uninstall problematic-package
npm install compatible-alternative

# Option B: If GPL compatible with your license, document it
# Create NOTICES file listing all licenses

# 4. Test and commit
npm run build
git commit -m "chore: update license compatibility"
git push origin main
```

---

### Performance Issues

#### ❌ Issue: "Build size exceeds threshold"

**Symptoms:**
```
⚠️ Bundle grew by ~150KB
Total size: 650KB (target: 500KB)
```

**Causes:**
- Added large library
- Unused code not being tree-shaken
- Large assets bundled

**Solutions:**
```bash
# 1. Analyze bundle locally
npm run build

# 2. Check bundle composition
du -sh .next/static/chunks/

# 3. Identify large chunks
ls -lhS .next/static/chunks/ | head -10

# 4. Review recent changes
git diff HEAD~5 package.json

# 5. Optimize:
# Option A: Remove unused dependency
npm uninstall large-library

# Option B: Use smaller alternative
npm uninstall moment
npm install date-fns

# Option C: Lazy load code
const largeLib = dynamic(() => import('large-library'))

# 6. Test and verify
npm run build
du -sh .next
```

---

#### ❌ Issue: "CI takes 10+ minutes (slow build)"

**Symptoms:**
```
Total build time: 12 minutes
Target: < 5 minutes
```

**Causes:**
- Large compilation time
- Dependencies downloading slow
- No caching
- Heavy computations during build

**Solutions:**
```bash
# 1. Profile locally
time npm run build

# 2. Enable caching in workflow
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}

# 3. Skip unnecessary jobs
- if: needs.detect-changes.outputs.has-frontend-changes == 'true'

# 4. Reduce Node versions tested
# Instead of [18, 20, 22], use [20]

# 5. Optimize build locally
# Check if build optimizations possible
npx next build --profile

# 6. Consider code split
# Lazy load large components
```

---

## 📊 Workflow Performance Optimization

### Build Times
```yaml
Current:  8 minutes
Target:   5 minutes
Strategy: Enable caching, detect-changes, reduce matrix

# Implement:
- Smart change detection (skip if no code changes)
- npm cache with lock file key
- .next cache between runs
- Reduce from 3 Node versions to 2
```

### Artifact Cleanup
```bash
# Remove old build artifacts
# Settings → Actions → General
# Artifact and log retention
# Set to: 3 days for small projects
```

---

## 🔄 Workflow Status Dashboard

### Check Workflow Health
```bash
# Get all recent runs
gh run list --limit 20 --json status,name,datedAt

# Get specific workflow stats
gh run list -w ci.yml --limit 50

# Calculate success rate
gh run list -w ci.yml --limit 100 --json status | grep -c success
```

### Track Trends
```bash
# Create simple CSV of run times
for run in $(gh run list -w ci.yml --limit 20 --json databaseId -q '.[] | .databaseId'); do
  echo "$(gh run view $run --json status,duration -q '.duration\\n.status')"
done > metrics.csv
```

---

## 🆘 Escalation Procedures

### Level 1: Self-Service (You can fix)
1. Check error message in logs
2. Review troubleshooting guide
3. Test locally
4. Push fix

### Level 2: Documentation Review
1. Read `COMPLETE_CI_CD_GUIDE.md`
2. Check `WORKFLOWS_QUICK_REFERENCE.md`
3. Review similar closed issues on GitHub

### Level 3: Team Review
1. Ask team if anyone seen this issue
2. Share error in team chat
3. Pair programming session

### Level 4: External Resources
1. Search GitHub Issues
2. Check Stack Overflow
3. Open GitHub Discussion
4. Create Issue on workflow action repository

### Level 5: Fallback Procedures

If production deployment broken:
```bash
# Immediate: Revert last change
git revert HEAD
git push origin main

# Will automatically trigger new CD
# Old version will be restored

# Then investigate:
git log --oneline -5
# Identify the bad commit

# Fix the issue locally
# Test thoroughly

# Push the fix when ready
```

---

## 📋 Issue Report Template

When reporting CI/CD issues:

```markdown
## Description
[What are you trying to do]

## Error Message
[Exact error from logs]

## Steps to Reproduce
1. Push code with [X] change
2. Workflow [Y] starts
3. Job [Z] fails

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Logs
[Paste relevant log section]

## Environment
- OS: [mac/linux/windows]
- Node version: [20.x]
- npm version: [10.x]

## Workaround (if any)
[If you found a temporary fix]
```

---

## 🎯 Preventive Measures

### Code Review Checklist
- [ ] No hardcoded credentials
- [ ] `process.env.*` used for secrets
- [ ] Appropriate error handling
- [ ] Tests added for feature
- [ ] No console.log() in production code
- [ ] No infinite loops

### Pre-Push Checklist
```bash
npm run lint    # Fix issues
npm run typecheck  # No type errors
npm run build   # Builds successfully

# Then push
git push origin main
```

### Regular Maintenance
- [ ] Weekly: Review failed CI runs
- [ ] Weekly: Check security scan results
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review workflow logs for patterns
- [ ] Quarterly: Update Node.js version

---

## 📞 Getting Help

**GitHub Actions Docs:** https://docs.github.com/actions  
**Actions Marketplace:** https://github.com/marketplace?type=actions  
**Community Discussions:** https://github.com/orgs/community/discussions

**For this Project:**
1. Check `COMPLETE_CI_CD_GUIDE.md`
2. Check this troubleshooting guide
3. Review workflow files inline comments
4. Ask team lead or senior developer

---

**Last Updated:** 2024  
**Version:** 1.0
