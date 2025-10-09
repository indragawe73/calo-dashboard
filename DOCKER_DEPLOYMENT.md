# Docker Deployment Guide

## ✅ Issues Fixed

### 1. **Dockerfile Build Path** ✅

- **Issue**: Copy from `/app/build` tapi Vite build ke `/app/dist`
- **Fix**: Changed to `COPY --from=build /app/dist`

### 2. **FromAsCasing Warning** ✅

- **Issue**: `FROM node:18-alpine as build` (lowercase 'as')
- **Fix**: Changed to `FROM node:18-alpine AS build` (uppercase 'AS')

### 3. **docker-compose Version** ✅

- **Issue**: `version: "3.8"` is obsolete
- **Fix**: Removed `version` field

### 4. **npm ci Error** ✅

- **Issue**: `npm ci` fails karena package-lock.json issue
- **Fix**: Changed to `npm install --legacy-peer-deps`

### 5. **.dockerignore Missing** ✅

- **Issue**: No .dockerignore file
- **Fix**: Created optimized .dockerignore

## 🚀 Deployment Commands

### Step 1: Upload Files ke Server

```bash
# Via SCP
scp calo-dashboard.zip sa@calo-ai:~/

# Or via rsync (better for incremental updates)
rsync -avz calo-dashboard.zip sa@calo-ai:~/
```

### Step 2: SSH ke Server

```bash
ssh sa@calo-ai
```

### Step 3: Extract Files

```bash
# Navigate to home directory
cd ~

# Unzip file
unzip -o calo-dashboard.zip

# Navigate to extracted folder
cd calo-fe-dashboard

# Check files
ls -la
```

### Step 4: Build & Run Docker

```bash
# Stop and remove old containers (if exists)
docker compose down

# Build and run in detached mode
docker compose up --build -d

# Check logs
docker compose logs -f

# Or check specific service logs
docker logs fastrtc-frontend -f
```

## 📋 Complete Deployment Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting CALO Dashboard Deployment..."

# Navigate to project directory
cd ~/calo-fe-dashboard

# Pull latest changes (if using git)
# git pull origin main

# Stop existing containers
echo "⏹️  Stopping existing containers..."
docker compose down

# Remove old images (optional, saves space)
echo "🗑️  Cleaning up old images..."
docker image prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up --build -d

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check status
echo "✅ Checking container status..."
docker compose ps

# Show logs
echo "📋 Container logs:"
docker compose logs --tail=50

echo "🎉 Deployment complete!"
echo "Frontend available at: http://localhost:7864"
```

**Make executable and run:**

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🛠️ Docker Commands Cheatsheet

### Build & Run

```bash
# Build and run
docker compose up --build -d

# Rebuild specific service
docker compose build fastrtc-frontend

# Run without rebuild
docker compose up -d
```

### Monitoring

```bash
# Check running containers
docker compose ps

# View logs (follow)
docker compose logs -f

# View logs (last 100 lines)
docker compose logs --tail=100

# Check container health
docker inspect --format='{{.State.Health.Status}}' fastrtc-frontend
```

### Maintenance

```bash
# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Restart containers
docker compose restart

# Rebuild without cache
docker compose build --no-cache
```

### Cleanup

```bash
# Remove stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove everything (careful!)
docker system prune -a -f
```

## 🐛 Troubleshooting

### Issue: npm ci failed

**Error:**

```
npm error code EUSAGE
npm error Run "npm help ci" for more info
```

**Solution:**
✅ Fixed in Dockerfile - now uses `npm install --legacy-peer-deps`

### Issue: COPY failed - /app/build not found

**Error:**

```
COPY failed: file not found in build context or excluded by .dockerignore: stat app/build: file does not exist
```

**Solution:**
✅ Fixed in Dockerfile - changed to `/app/dist` (Vite build output)

### Issue: docker-compose version warning

**Warning:**

```
WARN[0000] the attribute `version` is obsolete
```

**Solution:**
✅ Fixed in docker-compose.yml - removed `version: "3.8"`

### Issue: Port already in use

**Error:**

```
Error: bind: address already in use
```

**Solution:**

```bash
# Find process using port 7864
sudo lsof -i :7864

# Kill process
sudo kill -9 <PID>

# Or use different port in docker-compose.yml
```

### Issue: Permission denied

**Error:**

```
Got permission denied while trying to connect to Docker daemon
```

**Solution:**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
exit
ssh sa@calo-ai

# Or use sudo
sudo docker compose up --build -d
```

## 📊 Deployment Checklist

Before deploying:

- [ ] Update package.json dependencies
- [ ] Update .env file with correct API URLs
- [ ] Check nginx.conf configuration
- [ ] Verify all files are in zip
- [ ] Test locally with `npm run build`

During deployment:

- [ ] Upload zip file to server
- [ ] Extract with `unzip -o calo-dashboard.zip`
- [ ] Navigate to project directory
- [ ] Run `docker compose down` (stop old)
- [ ] Run `docker compose up --build -d` (build new)
- [ ] Check logs: `docker compose logs -f`
- [ ] Verify health: `docker compose ps`

After deployment:

- [ ] Test frontend at http://server-ip:7864
- [ ] Check API connectivity
- [ ] Test login functionality
- [ ] Test image list page
- [ ] Verify all filters work
- [ ] Check browser console for errors

## 🎯 Quick Deploy Commands

```bash
# One-liner deployment
ssh sa@calo-ai 'cd ~/calo-fe-dashboard && docker compose down && docker compose up --build -d && docker compose logs --tail=50'

# Or step by step:
ssh sa@calo-ai
cd ~/calo-fe-dashboard
docker compose down
docker compose up --build -d
docker compose logs -f
```

## ✅ Expected Output (Success)

```bash
$ docker compose up --build -d

[+] Building 45.2s (16/16) FINISHED
 => [build 1/6] FROM docker.io/library/node:18-alpine
 => [build 2/6] WORKDIR /app
 => [build 3/6] COPY package*.json ./
 => [build 4/6] RUN npm install --legacy-peer-deps
 => [build 5/6] COPY . .
 => [build 6/6] RUN npm run build
 => [stage-1 1/4] FROM docker.io/library/nginx:alpine
 => [stage-1 2/4] COPY nginx.conf /etc/nginx/conf.d/default.conf
 => [stage-1 3/4] COPY --from=build /app/dist /usr/share/nginx/html
 => [stage-1 4/4] RUN chown -R nginx:nginx /usr/share/nginx/html
 => exporting to image

[+] Running 1/1
 ✔ Container fastrtc-frontend  Started

$ docker compose ps
NAME                IMAGE                      STATUS
fastrtc-frontend    calo-fe-dashboard-fastrtc  Up 10 seconds (healthy)
```

## 📝 Files Fixed

| File                 | Change                                                 |
| -------------------- | ------------------------------------------------------ |
| `Dockerfile`         | ✅ Fixed `as` → `AS` (FromAsCasing)                    |
| `Dockerfile`         | ✅ Fixed `/app/build` → `/app/dist`                    |
| `Dockerfile`         | ✅ Changed `npm ci` → `npm install --legacy-peer-deps` |
| `docker-compose.yml` | ✅ Removed obsolete `version` field                    |
| `.dockerignore`      | ✅ Created new file                                    |

## 🎉 Ready to Deploy!

Sekarang jalankan:

```bash
docker compose up --build -d
```

Should work without errors! 🚀
