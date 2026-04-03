# CI/CD & Docker Setup Guide

## Overview

This project uses:
- **GitHub Actions** for CI/CD automation
- **Docker** for containerized deployment
- **Vercel** for production hosting

---

## 🐳 Docker Setup

### Local Development with Docker

Run the app with Docker Compose:

```bash
docker-compose up --build
```

The app will be available at `http://localhost:3000`

**Stop the container:**
```bash
docker-compose down
```

**Clean up (remove containers & images):**
```bash
docker-compose down -v
docker rmi $(docker images --filter "dangling=true" -q)
```

### Build Docker Image Manually

```bash
# Build the image
docker build -t propfusion:latest .

# Run the container
docker run -p 3000:3000 \
  -e BETTER_AUTH_SECRET=<your-secret> \
  -e MONGODB_URI=<your-uri> \
  -e BETTER_AUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  propfusion:latest
```

---

## ⚙️ GitHub Actions CI/CD Setup

### Step 1: Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

```
BETTER_AUTH_SECRET       = (from your .env.local)
BETTER_AUTH_URL          = https://propfusion.adityatambe.ca
MONGODB_URI              = (from your .env.local)
NEXT_PUBLIC_APP_URL      = https://propfusion.adityatambe.ca
RESEND_API_KEY           = (from your .env.local)
RESEND_FROM_EMAIL        = PropFusion <noreply@adityatambe.ca>
VERCEL_TOKEN             = (get from Vercel dashboard)
VERCEL_ORG_ID            = (get from Vercel dashboard)
VERCEL_PROJECT_ID        = (get from Vercel dashboard)
```

### Step 2: Get Vercel Credentials

1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Create a new token and copy it → Add as `VERCEL_TOKEN` secret
3. Get your Org ID from Vercel URL: `https://vercel.com/<ORG_ID>`
4. Get Project ID from project settings in Vercel

### Step 3: Workflow Triggers

The CI/CD pipeline runs automatically on:
- **Push to `main` branch** → Runs lint, build, Docker build, and deploys to Vercel
- **Push to `develop` branch** → Runs lint and build only (no deployment)
- **Pull requests to `main` or `develop`** → Runs lint and build only

### What the Pipeline Does

1. **Lint & Type Check** (1-2 minutes)
   - Installs dependencies
   - Runs ESLint
   - TypeScript type checking
   - Builds the app

2. **Build Docker Image** (only on main branch)
   - Creates Docker image
   - Pushes to GitHub Container Registry
   - Caches layers for faster builds

3. **Deploy to Vercel** (only on main branch)
   - Automatically deploys to production
   - Sets environment variables
   - Verifies deployment health

---

## 🚀 Deployment Workflow

### Local Development
```bash
# Make changes locally
npm run dev

# Test with Docker
docker-compose up --build
```

### Push to Repository
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Automatic CI/CD Triggers
1. GitHub Actions runs tests
2. If tests pass → Docker image is built
3. If build succeeds → Deployed to Vercel
4. Live at `https://propfusion.adityatambe.ca`

---

## 📊 Monitoring

### View GitHub Actions Logs
1. Go to your GitHub repo
2. Click **Actions** tab
3. Select the workflow run
4. Check logs for each job

### Vercel Deployment
- Visit: https://vercel.com/dashboard
- View deployment history
- Check logs and analytics

---

## 🔐 Security Best Practices

- ✅ Secrets stored in GitHub (not in code)
- ✅ Non-root user in Docker
- ✅ Environment variables passed at runtime
- ✅ Docker image caching optimized
- ✅ No sensitive data in `.dockerignore`

---

## 🛠️ Troubleshooting

### Docker build fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker-compose up --build
```

### Vercel deployment fails
- Check GitHub Actions logs
- Verify Vercel secrets are set correctly
- Check VERCEL_ORG_ID and VERCEL_PROJECT_ID

### Environment variables not set
- Go to GitHub Secrets and verify all are added
- Restart the workflow or re-trigger

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment/docker)
