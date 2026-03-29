# 📋 Workflow Quick Reference

Complete list of all GitHub Actions workflows with quick reference information.

## 🚀 Quick Index

| Workflow | File | Triggers | Duration | Purpose |
|----------|------|----------|----------|---------|
| **CI Pipeline** | `ci.yml` | Push to main/dev, PR | 5-8min | Lint, type-check, build validation |
| **CD Pipeline** | `cd.yml` | Main branch success | 10-15min | Deploy staging → production |
| **Security** | `security.yml` | Daily 2 AM, manual | 3-5min | Vulnerability & license scanning |
| **Performance** | `performance.yml` | Push to main, daily | 5-10min | Bundle, vitals, load testing |
| **Quality** | `quality.yml` | Push to main/dev, daily | 3-5min | Coverage, complexity, type safety |
| **Release** | `release.yml` | Manual workflow_dispatch | 3-5min | Versioning & GitHub releases |

---

## 📖 Detailed Workflow Information

### 1️⃣ Continuous Integration (`ci.yml`)

**When it runs:**
- ✅ Every push to `main` branch
- ✅ Every push to `develop` branch  
- ✅ All pull requests to `main`/`develop`
- ✅ Manual trigger via `workflow_dispatch`

**What it does:**
```
detect-changes (10s) → identifies modified files
     ↓
setup (45s) → installs Node 20 + dependencies
     ↓
lint (30s) → ESLint validation → continues on warnings
     ↓
typecheck (20s) → TypeScript strict check (fails on errors)
     ↓
build (3-5m) → Multi-node build: Node 20 + Node 22
     ↓
security (30s) → npm audit (soft-fail)
     ↓
performance (1m) → Bundle analysis
     ↓
ci-summary (5s) → Aggregate results
```

**Key Features:**
- 🎯 Smart change detection (skips unnecessary jobs)
- 📦 Dependency caching (80%+ faster on repeat)
- 🔍 Multi-node testing prevents version issues
- 📊 GitHub step summary with metrics
- 💾 Artifact uploads (.next for 5 days)
- ⚙️ Concurrency control: cancels stale runs

**Configuration:**
```yaml
# Customize warning threshold for lint
env:
  LINT_MAX_WARNINGS: 0

# Adjust node versions
strategy:
  matrix:
    node-version: [20, 22]

# Cache TTL (default: 5 days)
# Reduce artifacts retention:
retention-days: 3
```

**Success criteria:**
- ✅ ESLint passes (0 error level, warnings allowed)
- ✅ TypeScript compiles without errors
- ✅ Next.js build succeeds
- ✅ npm audit review complete

---

### 2️⃣ Continuous Deployment (`cd.yml`)

**When it runs:**
- ✅ Automatic: Successful push to `main` branch
- ✅ Manual: `workflow_dispatch` (emergency deploys)
- ℹ️ Only if CI pipeline passes

**What it does:**
```
pre-deployment-tests (5m) → Full suite: lint, type-check, build
     ↓
build-image (2-3m) → Docker build + ghcr.io push
     ↓
deploy-staging (2m) → Auto-deploy to staging
     ↓
smoke-tests-staging (1m) → Health check + endpoints
     ↓
approval (∞) → Manual gate (humans decide)
     ↓
deploy-production (2m) → Deploy to production
     ↓
smoke-tests-production (1m) → Production health check
     ↓
[If failure] rollback → Automatic recovery
     ↓
deployment-summary (1m) → Final status report
```

**Key Features:**
- 🛡️ Pre-deploy full test suite (no untested code)
- 🐳 Docker image building + registry push
- 📊 Staged deployment (safe → production)
- 🚪 Manual approval gate for production
- 🔄 Automatic rollback on failure
- 💓 Health checks with exponential backoff
- 🔑 Environment-based secret management

**Configuration:**
```yaml
# Update deployment commands for your platform
# Look for "Replace with your actual..." comments

# Set timeouts for health checks
timeout-minutes: 15

# Configure health check endpoint
env:
  HEALTH_CHECK_ENDPOINT: /api/health
  HEALTH_CHECK_RETRIES: 10
  HEALTH_CHECK_TIMEOUT: 15
```

**Environment Setup:**
```bash
# GitHub Settings → Environments → staging
Deployment branches: main, develop
Auto-approve: Yes (automatic deployment)

# GitHub Settings → Environments → production  
Deployment branches: main
Auto-approve: No
Approvers: [team leads, senior devs]
```

**Deployment targets support:**
- ✅ Vercel
- ✅ AWS (EB, EC2, Lambda)
- ✅ Heroku
- ✅ DigitalOcean
- ✅ Azure
- ✅ Custom servers
- ✅ Kubernetes

**Success criteria:**
- ✅ All pre-deployment tests pass
- ✅ Docker image builds successfully
- ✅ Staging deployment succeeds
- ✅ Staging smoke tests pass
- ✅ Manual approval granted
- ✅ Production deployment succeeds
- ✅ Production health checks pass

---

### 3️⃣ Security Monitoring (`security.yml`)

**When it runs:**
- ✨ Every Monday at 2 AM UTC (configurable)
- ✨ Manual trigger via `workflow_dispatch`
- ✨ Can be scheduled for daily runs

**What it does:**
```
update-dependencies (3m) → Check for outdated packages
     ↓
security-scan (2m) → npm audit for vulnerabilities
     ↓
sast-analysis (3m) → ESLint security rules
                     Check for: eval(), dangerouslySetInnerHTML, hardcoded env
     ↓
dependency-graph (1m) → Update GitHub dependency graph
     ↓
license-check (1m) → Verify package license compatibility
     ↓
security-summary → Aggregate all results
```

**Key Features:**
- 🔍 Daily vulnerability scanning
- 📋 License compliance checking
- 🔐 Static code analysis (SAST)
- 📊 GitHub dependency graph integration
- ⚠️ Critical alerts for serious vulnerabilities
- 📈 Trend tracking over time

**Configuration:**
```yaml
# Change schedule
schedule:
  - cron: "0 2 * * MON"  # Weekly (default)
  # - cron: "0 2 * * *"    # Daily (uncomment)
  # - cron: "0 */6 * * *"  # Every 6 hours

# Adjust vulnerability threshold
run: npm audit --audit-level=moderate
```

**Outputs:**
- 📄 Audit report (JSON artifact)
- 🔗 License report summary
- 🚨 Critical vulnerability alerts
- 📦 Outdated packages list

**Success criteria:**
- ✅ No critical vulnerabilities
- ✅ All license compatible
- ✅ No suspicious code patterns

---

### 4️⃣ Performance Benchmarking (`performance.yml`)

**When it runs:**
- ✅ After push to `main` branch
- ✅ Daily at 3 AM UTC (for trend tracking)
- ✅ Manual trigger via `workflow_dispatch`

**What it does:**
```
bundle-analysis (2m) → Measure .next folder size
                      Track directory breakdown
                      File count analysis
     ↓
web-vitals (2m) → Check for common bottlenecks
                 Component size analysis
                 Import analysis
     ↓
load-simulation (3m) → Start dev server
                       Test response times by route
                       HTTP status verification
     ↓
memory-profile (2m) → Track build memory usage
                      Peak resident memory
     ↓
perf-summary → Aggregate metrics & trends
```

**Key Features:**
- 📊 Bundle size tracking (alerts on growth)
- 🚀 Response time measurements
- 💾 Memory usage profiling
- 📈 Trend analysis (over time)
- 🎯 Performance goals verification
- 📋 Optimization recommendations

**Metrics Tracked:**
```
Bundle:        < 500KB gzip
LCP:           < 2.5s
FID:           < 100ms
CLS:           < 0.1
API Response:  < 500ms
```

**Configuration:**
```yaml
# Adjust schedule
schedule:
  - cron: "0 3 * * *"  # Change time

# Update performance goals
env:
  BUNDLE_SIZE_TARGET: 500  # KB
  LCP_TARGET: 2500        # ms
  FID_TARGET: 100         # ms
```

**Success criteria:**
- ✅ Bundle size within target
- ✅ Build memory reasonable
- ✅ Response times acceptable
- ✅ No major regressions

---

### 5️⃣ Code Quality Analytics (`quality.yml`)

**When it runs:**
- ✅ Push to `main` or `develop`
- ✅ All pull requests
- ✅ Daily at 4 AM UTC
- ✅ Manual trigger

**What it does:**
```
coverage-analysis (3m) → Run test suite (requires Jest/Vitest)
                       Track coverage %
     ↓
complexity-analysis (2m) → Analyze cyclomatic complexity
                          Find hotspot files
                          ImportExport tracking
     ↓
lint-compliance (1m) → ESLint rule compliance
                      Error/warning count
     ↓
type-safety (2m) → TypeScript strict check
                  Coverage analysis
     ↓
dependencies-health (2m) → Check outdated packages
                           Dev vs production split
     ↓
quality-gates → Summary of all metrics
```

**Key Features:**
- 📊 Code coverage tracking (80%+ target)
- 📈 Complexity metrics (identify refactoring candidates)
- ✅ Lint rule compliance
- 🔒 Type safety verification
- 📚 Dependency health monitoring
- 🎯 Quality gates enforcement

**Coverage Targets:**
```
Statements: 80%+
Branches:   75%+
Functions:  80%+
Lines:      80%+
```

**Configuration:**
```yaml
# Add test framework
npm install --save-dev jest @testing-library/react

# Configure Jest in package.json
# Then set up test:coverage script

# Adjust coverage thresholds
collectCoverageFrom:
  - src/**/*.ts
  - src/**/*.tsx
  - "!src/**/*.d.ts"

coverageThreshold:
  global:
    statements: 80
    branches: 75
    functions: 80
    lines: 80
```

**Success criteria:**
- ✅ Coverage at or above targets
- ✅ No lint errors
- ✅ TypeScript strict mode passing
- ✅ Dependencies up to date

---

### 6️⃣ Release Management (`release.yml`)

**When it runs:**
- 🎯 Manual only via `workflow_dispatch` input

**What it does:**
```
determine-version (10s) → Calculate next semantic version
                        Input: patch|minor|major
     ↓
generate-changelog (20s) → Extract commits since last tag
                          Format as markdown list
     ↓
update-version (30s) → Update package.json version
                      Create app/version.ts
                      Commit to main
     ↓
build-release (5m) → Full production build
                    Create .tar.gz artifact
     ↓
create-release (30s) → Create GitHub Release
                      Upload artifacts
     ↓
notify-release (10s) → Send notifications (Slack optional)
                      Post summary
```

**Key Features:**
- 📌 Automated semantic versioning
- 📝 Auto-generated changelog
- 🎁 Build artifact creation
- 🏷️ GitHub Release + tag creation
- 📊 Release notes generation
- 🔔 Notification integration (optional)

**Version Bump Types:**

| Type | Example | Use Case |
|------|---------|----------|
| `patch` | v1.0.1 | Bug fixes, hotfixes |
| `minor` | v1.1.0 | Features, improvements |
| `major` | v2.0.0 | Breaking changes |

**Configuration:**
```yaml
# Enable Slack notifications (optional)
# Set SLACK_WEBHOOK secret first

# Customize release notes template
# Modify 'Create release notes' step

# Adjust artifact retention
retention-days: 30
```

**Manual Trigger:**
```bash
# Via GitHub UI:
# Actions → Release Management → Run workflow
# Select version type (patch/minor/major)

# Via CLI:
gh workflow run release.yml -f version-type=minor
```

**Success criteria:**
- ✅ Version properly bumped
- ✅ GitHub Release created
- ✅ Artifacts uploaded
- ✅ Changelog generated
- ✅ Tag pushed

---

## 🎛️ Common Customizations

### Change CI schedule
```yaml
# File: .github/workflows/ci.yml
on:
  push:
    branches: [main, develop]  # Add/remove branches
  schedule:
    - cron: "0 9 * * 1-5"      # Weekdays 9 AM UTC
```

### Add environment variables
```yaml
# File: .github/workflows/cd.yml
env:
  AWS_REGION: us-east-1
  NODE_ENV: production
```

### Modify notification recipients
```yaml
# File: .github/workflows/release.yml
- name: Slack notification
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    # Add more recipients
```

### Skip a workflow run
```bash
# Add [skip ci] to commit message
git commit -m "docs: update readme [skip ci]"

# Or use workflow event filter
git commit -m "ci: workflowfile update" --skip-ci
```

---

## 🆘 Quick Troubleshooting

### Workflow not triggering
- ✅ Verify trigger conditions (branch name, file paths)
- ✅ Check if workflows are enabled: Settings → Actions → General
- ✅ Verify GITHUB_TOKEN has necessary permissions
- ✅ Check cron syntax: [crontab.guru](https://crontab.guru)

### Job failed - what to do?
```bash
# 1. Check logs
gh run view <run-id> --log

# 2. Re-run failed job (if applicable)
gh run rerun <run-id> --failed

# 3. Review error step by step
# Look for "Error:" in logs
```

### Secrets not accessible
- ✅ Verify secret name matches exactly (case-sensitive)
- ✅ Confirm secret exists in repo settings
- ✅ Ensure you're using `${{ secrets.SECRET_NAME }}`
- ✅ Check branch has access to secrets

### Deployment stuck
- ✅ Check for manual approval pending (production gate)
- ✅ Verify health check endpoint is accessible
- ✅ Review environment configuration
- ✅ Check for concurrency locks

---

## 📊 Monitoring & Metrics

### Key Metrics to Track

```yaml
CI Health:
  - Pass rate (target: 95%+)
  - Average duration
  - Peak resource usage

CD Health:
  - Deployment frequency
  - Deployment success rate
  - Rollback frequency
  - Time to detect issues

Quality:
  - Code coverage trend
  - Bug escape rate
  - Security issues
  - Performance regression
```

### View Action Runs
```bash
# List recent runs
gh run list --limit 20

# View detailed run
gh run view <run-id>

# Get logs
gh run view <run-id> --log

# Retrieve specific job logs
gh run view <run-id> --log --json logs | jq '.logs[0]'
```

---

## 📚 Additional Resources

- **GitHub Actions Docs:** https://docs.github.com/actions
- **Workflow Syntax:** https://docs.github.com/actions/reference/workflow-syntax-for-github-actions
- **Best Practices:** https://docs.github.com/actions/guides
- **Security:** https://docs.github.com/actions/security-guides

---

**For complete setup guide, see:** [`COMPLETE_CI_CD_GUIDE.md`](./COMPLETE_CI_CD_GUIDE.md)

**Last Updated:** 2024 | Version: 2.0
