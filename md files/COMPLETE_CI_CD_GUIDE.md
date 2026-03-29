# 🚀 Enterprise CI/CD Pipeline Guide

Complete production-ready GitHub Actions setup for FinanceFlow with best practices from 5+ years of full-stack development.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Workflow Documentation](#workflow-documentation)
4. [Setup & Configuration](#setup--configuration)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### 1. Deploy Workflows (1 minute)

```bash
# Workflows are already created in .github/workflows/
# Just commit and push:
git add .github/workflows/
git commit -m "feat: add enterprise CI/CD pipelines"
git push origin main
```

### 2. Configure Secrets (5 minutes)

In GitHub: **Settings → Secrets and variables → Actions**

**Required Secrets:**
```yaml
# Staging
STAGING_DEPLOY_KEY=your-staging-ssh-key
STAGING_URL=https://staging.yourapp.com
STAGING_MONGODB_URI=mongodb://...

# Production  
PRODUCTION_DEPLOY_KEY=your-prod-ssh-key
PRODUCTION_URL=https://yourapp.com
PRODUCTION_MONGODB_URI=mongodb://...

# Optional: Notifications
SLACK_WEBHOOK=https://hooks.slack.com/...
GITHUB_TOKEN=github_pat_...
```

### 3. Customize Deployment (5 minutes)

Edit `.github/workflows/cd.yml` and replace deployment commands:

**For Vercel:**
```yaml
- run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**For AWS Elastic Beanstalk:**
```yaml
- run: |
    pip install awsebcli
    eb deploy production
```

**For Heroku:**
```yaml
- run: git push heroku main:main
```

**For custom server:**
```yaml
- run: |
    scp -r .next user@${{ secrets.PRODUCTION_URL }}:/app/
    ssh user@${{ secrets.PRODUCTION_URL }} "cd /app && npm install && npm start"
```

### 4. Test It

```bash
# Manual trigger development build
# GitHub UI: Actions → CI → Run workflow

# Or via command line:
gh workflow run ci.yml --ref develop
```

---

## 🏗️ Architecture Overview

### Pipeline Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Push                            │
└────────────────────────────┬────────────────────────────────┘

                             ↓

            ┌────────────────────────────────┐
            │  CONTINUOUS INTEGRATION (CI)   │
            │  .github/workflows/ci.yml      │
            │  Triggers: push to main/dev    │
            └────────┬───────────────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   ┌────────┐ ┌──────────┐ ┌──────────┐
   │ Detect │ │  Setup   │ │   Lint   │
   │Changes │ │ Node+npm │ │ Rules    │
   └────────┘ └──────────┘ └──────────┘

        ↓            ↓            ↓
   ┌────────┐ ┌──────────┐ ┌──────────┐
   │Typecheck│ │  Build   │ │Security  │
   │TypeScript│ │Multi-node│ │  Audit   │
   └────────┘ └──────────┘ └──────────┘

        ↓            ↓
   ┌────────────────────────┐
   │  Performance Analysis  │
   │    & Summary Report    │
   └────────┬───────────────┘
            │
            ↓ (if main branch)

            ┌────────────────────────────────────┐
            │ CONTINUOUS DEPLOYMENT (CD)         │
            │ .github/workflows/cd.yml           │
            │ Triggers: successful push to main  │
            └────────┬───────────────────────────┘
                     │
            ┌────────┴──────────┐
            ↓                   ↓
      ┌──────────┐        ┌──────────┐
      │ Pre-test │        │Build/Push│
      │ Suite    │        │Docker    │
      └──────────┘        └──────────┘
                               │
                ┌──────────────┴──────────────┐
                ↓                            ↓
          ┌──────────┐               ┌──────────┐
          │ Deploy   │               │ Smoke    │
          │ Staging  │               │ Test     │
          │ (AUTO)   │               │ Staging  │
          └──────────┘               └──────────┘
                │                         │
                └────────────────┬────────┘
                                 ↓
                        ┌──────────────────┐
                        │ Manual Approval  │
                        │ Gate (GitHub UI) │
                        └────────┬─────────┘
                                 ↓
                        ┌──────────────────┐
                        │Deploy Production │
                        │(Manual + Approval│
                        └────────┬─────────┘
                                 ↓
                        ┌──────────────────┐
                        │Health Check      │
                        │Production        │
                        └────────┬─────────┘
                                 ↓
                        ┌──────────────────┐
                        │If Failure:       │
                        │Auto Rollback +   │
                        │Health Check      │
                        └──────────────────┘
```

### Supporting Workflows

#### 🔐 Security Monitoring (`security.yml`)
- Daily vulnerability scans
- License compliance checks
- Static code analysis (SAST)
- Dependency graph updates

#### 📈 Performance Tracking (`performance.yml`)
- Bundle size analysis
- Web Vitals checks
- Load test simulation
- Memory profiling

#### 📊 Code Quality (`quality.yml`)
- Coverage analysis
- Complexity metrics
- Lint compliance
- Type safety checks
- Dependency health

#### 🎉 Release Management (`release.yml`)
- Automated versioning
- Changelog generation
- Release notes creation
- GitHub releases with artifacts

---

## 📚 Workflow Documentation

### 1. CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop`
- Manual via `workflow_dispatch`
- Pull requests

**Jobs:**

| Job | Purpose | Duration |
|-----|---------|----------|
| `detect-changes` | Smart detection of modified files | 10s |
| `setup` | Install Node 20 + dependencies | 45s |
| `lint` | ESLint code style validation | 30s |
| `typecheck` | TypeScript strict mode validation | 20s |
| `build` | Multi-node build (20, 22) | 3-5m |
| `security` | npm audit + vulnerability scan | 30s |
| `performance` | Bundle analysis | 1m |
| `ci-summary` | Aggregate results & report | 5s |

**Outputs:**
- ✅ GitHub check status
- 📝 Step summary with metrics
- 📦 Build artifacts (`.next` folder for 5 days)
- 🔐 Security audit results

**Optimization Features:**
```yaml
# Smart job skipping
if: needs.detect-changes.outputs.has-frontend-changes == 'true'

# Caching strategies
cache:
  path: ~/.npm
  key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}

# Matrix testing
strategy:
  matrix:
    node-version: [20, 22]
```

---

### 2. CD Pipeline (`cd.yml`)

**Triggers:**
- Automatic: Push to `main` branch (only if CI passes)
- Manual: `workflow_dispatch` for emergency deployments

**Jobs:**

| Job | Purpose | Condition |
|-----|---------|-----------|
| `pre-deployment-tests` | Full test suite before any deploy | Always |
| `build-image` | Docker image build + registry push | Always |
| `deploy-staging` | Auto-deploy to staging | Main branch only |
| `smoke-tests-staging` | Verify staging deployment | After staging deploy |
| `approval` | Manual review & approval gate | Always (optional skip) |
| `deploy-production` | Deploy to production | Manual approval required |
| `smoke-tests-production` | Verify production | After prod deploy |
| `rollback-production` | Auto-rollback if failure | On smoke test failure |
| `deployment-summary` | Report final status | Always |

**Safety Features:**

```yaml
# Pre-deployment validation
- run: npm run lint && npm run typecheck && npm run build

# Health checks with retry
- run: |
    for i in {1..10}; do
      curl -f http://${{ env.STAGING_URL }}/api/health && break
      sleep 15
    done

# Automatic rollback on failure
on:
  workflow_run:
    - if failure
    - then: deploy previous version

# Manual approval gate
environment:
  name: production
  approval-required: true
  reviewers: [team-leads]
```

**Environment Variables:**
```yaml
staging:
  url: ${{ secrets.STAGING_URL }}
  db-uri: ${{ secrets.STAGING_MONGODB_URI }}

production:
  url: ${{ secrets.PRODUCTION_URL }}
  db-uri: ${{ secrets.PRODUCTION_MONGODB_URI }}
```

---

### 3. Security Workflow (`security.yml`)

**Schedule:** Daily (configurable)

**Components:**

| Component | Purpose | Frequency |
|-----------|---------|-----------|
| Dependency Updates | Check for outdated packages | Weekly |
| Vulnerability Scan | npm audit + npm audit fix | Daily |
| SAST Analysis | ESLint security rules | Daily |
| License Check | Verify package licenses | Weekly |

**Outputs:**
- 📋 License compatibility report
- 🔒 Vulnerability summary
- 🚨 Critical alerts
- 📊 Dependency graph

---

### 4. Performance Workflow (`performance.yml`)

**Schedule:** 
- On push to main
- Daily at 3 AM UTC
- Manual trigger

**Metrics Tracked:**

```
Bundle Analysis:
  - Total .next size
  - Breakdown by directory
  - JS/CSS file counts

Web Vitals:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - TTL (Time to Interactive)

Load Testing:
  - Response times by route
  - HTTP status codes
  - Concurrent request handling

Memory:
  - Peak build memory usage
  - Node.js heap utilization
```

---

### 5. Quality Workflow (`quality.yml`)

**Schedule:** 
- On push to main/develop
- Daily at 4 AM UTC
- On pull requests

**Metrics:**

```
Coverage Goals:
  - Statements: 80%+
  - Branches: 75%+
  - Functions: 80%+
  - Lines: 80%+

Complexity Analysis:
  - Cyclomatic complexity per file
  - Function size distribution
  - Import/export tracking

Lint Compliance:
  - ESLint errors (hard fail)
  - ESLint warnings (soft fail)
  - Code style consistency

Type Safety:
  - TypeScript strict mode ✓
  - No implicit any ✓
  - Explicit return types ✓
```

---

### 6. Release Workflow (`release.yml`)

**Triggers:** Manual only (`workflow_dispatch`)

**Process:**

```
Input: Version Type (patch|minor|major)
  ↓
Determine new version (semver)
  ↓
Generate changelog from commits
  ↓
Update version files (package.json, version.ts)
  ↓
Commit version bump to main
  ↓
Build production artifact
  ↓
Create GitHub Release
  ↓
Upload build artifacts
  ↓
Post notification (Slack optional)
```

**Release Notes Include:**
- Change list from commits
- Installation instructions
- Build information
- Release date & commit SHA

---

## 🔧 Setup & Configuration

### GitHub Secrets Setup

1. **Navigate to:** Settings → Secrets and variables → Actions

2. **Create secrets:**

```bash
# Production deployment
PRODUCTION_DEPLOY_KEY=<your-ssh-key>
PRODUCTION_URL=https://api.yourapp.com
PRODUCTION_MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prod

# Staging deployment  
STAGING_DEPLOY_KEY=<your-staging-ssh-key>
STAGING_URL=https://staging-api.yourapp.com
STAGING_MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/staging

# Optional: Notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
GITHUB_TOKEN=<github-pat-token>

# Optional: Docker Registry
DOCKER_REGISTRY_USERNAME=your-username
DOCKER_REGISTRY_PASSWORD=your-password
```

### Environment Protection Rules

1. **Settings → Environments → staging**
   - Deployment branches: `main`, `develop`
   - Approvers: Optional (automatic in this setup)

2. **Settings → Environments → production**
   - Deployment branches: `main` only
   - Approvers: Required (team leads)
   - Prevent forked PRs: Yes

### Branch Protection Rules

1. **Settings → Branches → main:**
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass (CI)
   - ✅ Require code reviews before merging
   - ✅ Require approval from code owners
   - ✅ Dismiss stale pull request approvals

2. **develop branch (optional):**
   - ✅ Require status checks to pass (CI)
   - ❌ No approval required (speed up dev)

### Deployment Platform Integration

#### **Vercel**
```yaml
# In cd.yml replace deploy-staging step:
- run: |
    vercel deploy --token=${{ secrets.VERCEL_TOKEN }} \
      --build-env ENVIRONMENT=staging \
      --yes
```

#### **AWS**
```yaml
- run: |
    pip install awsebcli
    export AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }}
    export AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }}
    eb deploy production-env
```

#### **Heroku**
```yaml
- run: |
    git remote add heroku https://git.heroku.com/yourapp.git
    git push heroku main:main
```

#### **DigitalOcean / Linode**
```yaml
- run: |
    export SSH_KEY=${{ secrets.PRODUCTION_DEPLOY_KEY }}
    ssh-keyscan -H ${{ secrets.PRODUCTION_URL }} >> ~/.ssh/known_hosts
    ssh user@${{ secrets.PRODUCTION_URL }} 'cd /app && git pull && npm install && npm run build && systemctl restart app'
```

---

## ✅ Best Practices

### 1. Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `perf:` Performance improvement
- `test:` Test addition
- `docs:` Documentation
- `ci:` CI/CD changes
- `chore:` Maintenance

**Example:**
```
feat(dashboard): add real-time portfolio updates

- Implement WebSocket connection for live prices
- Add 60-second refresh fallback
- Update portfolio card components

Closes #123
```

### 2. Pull Request Checklist

Before merging to `main`:
- ✅ CI pipeline passes (lint, typecheck, build)
- ✅ Code review approved by 2+ reviewers
- ✅ All conversations resolved
- ✅ Branch is up-to-date with main
- ✅ No hardcoded secrets or credentials
- ✅ Documentation updated
- ✅ Tests added/updated

### 3. Environment Management

```yaml
# .env.example (commit to repo)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_ENV=development
DATABASE_URL=

# .env.local (DO NOT COMMIT)
# Use GitHub secrets instead for CI/CD
```

### 4. Monitoring & Alerting

**Set up alerts for:**
- CI failures on main branch
- CD rollbacks
- Performance regressions
- Security vulnerabilities (critical)
- Deployment failures

### 5. Release Cadence

**Recommended:**
- **Patch** (v1.0.x): Bug fixes, hotfixes → Daily/weekly
- **Minor** (v1.x.0): Features, enhancements → Weekly/bi-weekly
- **Major** (vx.0.0): Breaking changes → Monthly/quarterly

**Steps:**
```bash
# 1. Create release branch
git checkout -b release/v1.2.0

# 2. Update changelog, version
# Already done by release workflow

# 3. Merge to main and tag
git push origin release/v1.2.0
# Create PR, get approval, merge

# 4. Trigger release from GitHub Actions UI
# Select version type and run release.yml
```

---

## 🐛 Troubleshooting

### Q: CI pipeline fails on a specific step

**Solution:**
1. Check GitHub Actions logs: Repository → Actions → Failed workflow
2. Look for error message in job logs
3. Common issues:
   - Missing environment variables
   - Changed dependency versions
   - File path changes
   - Node version incompatibility

### Q: CD deployment stuck waiting for approval

**Solution:**
1. Navigate to: Repository → Environments → production
2. Find the pending deployment
3. Click "Review deployments"
4. Approve or reject with comment

### Q: Rollback didn't work

**Verification:**
```bash
# Check rollback status in Actions tab
gh run view <run-id> --log

# Manual rollback:
git revert <commit-id>
git push origin main
```

### Q: Docker image failed to build

**Debug:**
```bash
# Build locally to test
docker build -f Dockerfile -t financeflow .

# Check Dockerfile syntax
docker build --no-cache -t financeflow .

# View build logs
gh run view <run-id> --log | grep docker
```

### Q: Secrets not accessible in workflow

**Check:**
1. Secrets exist in Settings → Secrets
2. Secret name matches exactly (case-sensitive)
3. Repository workflow has `secrets: inherit`
4. Secret not masked in logs (expected behavior)

**If still failing:**
```yaml
# Use syntax exactly:
env:
  DEPLOY_KEY: ${{ secrets.PRODUCTION_DEPLOY_KEY }}
run: echo $DEPLOY_KEY
```

### Q: Performance dropped significantly

**Investigate:**
1. Check `performance.yml` results
2. Review recent commits
3. Compare bundle sizes
4. Check dependency updates
5. Profile with Chrome DevTools

```bash
# Analyze locally:
npm run build
du -sh .next

# Compare with main:
git stash && npm run build && du -sh .next
```

### Q: Security scan showing vulnerabilities

**Response:**
```bash
# Auto-fix minor/patch issues
npm audit fix

# Review remaining issues
npm audit

# If acceptable, acknowledge:
npm audit --audit-level=moderate

# Commit fix
git add package.json package-lock.json
git commit -m "fix: resolve npm audit vulnerabilities"
```

---

## 📊 Monitoring Dashboard

### Recommended Tools

1. **GitHub Actions**
   - Built-in dashboard
   - Retention: 90 days
   - Cost: Included with GitHub

2. **CloudWatch / DataDog** (Production)
   - Real-time monitoring
   - Custom metrics
   - Alerting integration

3. **Vercel Analytics** (if using Vercel)
   - Web Vitals
   - Real user monitoring
   - Performance insights

### Key Metrics to Track

```
CI/CD Health:
  - CI pass rate (target: 95%+)
  - Build time trend (target: maintain/reduce)
  - Test coverage (target: 80%+)
  - Security scan issues (target: 0 critical)

Deployment Safety:
  - Deployment frequency (target: 1-2× per day)
  - Lead time (target: < 1 hour)
  - MTTR (target: < 30 minutes)
  - Rollback rate (target: < 5%)

Performance:
  - Build size (target: < 500KB gzip)
  - LCP (target: < 2.5s)
  - FID (target: < 100ms)
  - CLS (target: < 0.1)
```

---

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [DevOps Handbook](https://itrevolution.com/product/the-devops-handbook/)
- [12 Factor App](https://12factor.net/)
- [SRE Book - Google](https://sre.google/books/)

---

## 📞 Support & Updates

**Workflow Updates Available:**
- Add E2E testing (Playwright)
- Add visual regression testing
- Add database backup automation
- Add feature flag integration
- Add infrastructure as code (Terraform)

**Extend Current Setup With:**
- Slack/Teams notifications
- Custom status checks
- Performance benchmarking dashboard
- Canary deployment strategy
- Blue-green deployment pattern

---

**Generated with 5+ years full-stack development best practices** ✨
