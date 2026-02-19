# Deployment Instructions

This guide covers deploying the SparkAI application to production environments.

## Architecture Overview

```
                    ┌──────────────┐
                    │   Nginx /    │
                    │   Cloudflare │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
     │ Admin Panel │ │ Backend  │ │  Mobile App │
     │  (Next.js)  │ │ (Express)│ │   (Expo)    │
     │  Vercel /   │ │  AWS EC2 │ │ App Store / │
     │  Netlify    │ │  Railway │ │ Google Play │
     └─────────────┘ └────┬─────┘ └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  MySQL 8  │
                    │ AWS RDS / │
                    │ PlanetScale│
                    └───────────┘
```

---

## 1. Database (MySQL)

### Option A: AWS RDS (Recommended for Production)

1. Create a MySQL 8.0 instance on AWS RDS:
   ```
   Engine: MySQL 8.0
   Instance: db.t3.micro (free tier) or db.t3.small
   Storage: 20 GB gp3
   Multi-AZ: Disabled (dev) / Enabled (production)
   ```

2. Configure security group to allow inbound MySQL (port 3306) from your backend server's IP/security group.

3. Note down the endpoint, username, password, and database name.

4. Run the schema:
   ```bash
   mysql -h <rds-endpoint> -u <username> -p < database/schema.sql
   ```

### Option B: PlanetScale (Serverless MySQL)

1. Create a database at [planetscale.com](https://planetscale.com)
2. Use the provided connection string in your backend `.env`
3. PlanetScale handles scaling, backups, and branching automatically

### Option C: Docker (Self-hosted)

```bash
docker-compose up -d mysql
```

---

## 2. Backend API (Node.js / Express)

### Option A: Railway (Fastest)

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Connect your GitHub repo
4. Set the root directory to `packages/backend`
5. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=<your-mysql-host>
   DB_PORT=3306
   DB_NAME=sparkai_db
   DB_USER=<username>
   DB_PASS=<password>
   JWT_SECRET=<generate-a-strong-secret>
   JWT_REFRESH_SECRET=<generate-another-strong-secret>
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   ```
6. Set build command: `npm run shared:build && npm run backend:build`
7. Set start command: `npm run backend:start`
8. Railway auto-deploys on every push

### Option B: AWS EC2 / DigitalOcean Droplet

1. **Provision a server** (Ubuntu 22.04 LTS, 1 GB RAM minimum)

2. **Install dependencies:**
   ```bash
   # Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # PM2 process manager
   sudo npm install -g pm2

   # Nginx reverse proxy
   sudo apt install -y nginx
   ```

3. **Clone and build:**
   ```bash
   git clone <repo-url> /var/www/sparkaiproject
   cd /var/www/sparkaiproject
   npm install
   npm run shared:build
   npm run backend:build
   ```

4. **Create production `.env`:**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   # Edit with production values
   nano packages/backend/.env
   ```

5. **Start with PM2:**
   ```bash
   cd packages/backend
   pm2 start dist/index.js --name sparkai-api
   pm2 save
   pm2 startup  # Auto-start on reboot
   ```

6. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/sparkai-api
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/sparkai-api /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

7. **SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Option C: Docker

```dockerfile
# packages/backend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
RUN npm install
RUN npm run shared:build
RUN npm run backend:build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/package.json ./
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

```bash
docker build -f packages/backend/Dockerfile -t sparkai-api .
docker run -d -p 5000:5000 --env-file packages/backend/.env sparkai-api
```

---

## 3. Admin Panel (Next.js)

### Option A: Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com), import the repository
3. Set root directory to `packages/admin-panel`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
   ```
5. Deploy - Vercel handles build, CDN, and SSL automatically

### Option B: Netlify

1. Connect GitHub repo on [netlify.com](https://netlify.com)
2. Build settings:
   - Base directory: `packages/admin-panel`
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add `NEXT_PUBLIC_API_URL` environment variable

### Option C: Self-hosted (Nginx + PM2)

```bash
cd /var/www/sparkaiproject
npm run admin:build

cd packages/admin-panel
pm2 start npm --name sparkai-admin -- start
```

Nginx config (similar to backend, proxy to port 3001).

---

## 4. Mobile App (React Native / Expo)

### Pre-deployment Setup

1. **Update API URL** in `packages/mobile-app/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://api.yourdomain.com/api/v1';
   ```

2. **Update `app.json`** with production values:
   ```json
   {
     "expo": {
       "name": "SparkAI Services",
       "slug": "sparkai-services",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.yourcompany.sparkai",
         "buildNumber": "1"
       },
       "android": {
         "package": "com.yourcompany.sparkai",
         "versionCode": 1
       }
     }
   }
   ```

### Build with EAS (Expo Application Services)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS Build
cd packages/mobile-app
eas build:configure
```

### Android Build

```bash
# Development build (APK)
eas build --platform android --profile preview

# Production build (AAB for Play Store)
eas build --platform android --profile production
```

### iOS Build

```bash
# Development build
eas build --platform ios --profile preview

# Production build (for App Store)
eas build --platform ios --profile production
```

### Submit to App Stores

```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

## 5. Environment Variables Checklist

### Backend (packages/backend/.env)
| Variable | Description | Example |
|----------|------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | MySQL host | `mydb.rds.amazonaws.com` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `sparkai_db` |
| `DB_USER` | Database user | `sparkai` |
| `DB_PASS` | Database password | `<strong-password>` |
| `JWT_SECRET` | JWT signing key | `<random-64-char-string>` |
| `JWT_REFRESH_SECRET` | Refresh token key | `<random-64-char-string>` |
| `JWT_EXPIRES_IN` | Token TTL | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh TTL | `30d` |

### Admin Panel (packages/admin-panel/.env.local)
| Variable | Description | Example |
|----------|------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yourdomain.com/api/v1` |

### Mobile App (hardcoded in api.ts)
| Variable | Description | Example |
|----------|------------|---------|
| `API_BASE_URL` | Backend API URL | `https://api.yourdomain.com/api/v1` |

---

## 6. Production Checklist

- [ ] MySQL database provisioned with schema applied
- [ ] Database seeded with roles and initial admin user
- [ ] Backend deployed with production environment variables
- [ ] Strong JWT secrets generated (`openssl rand -hex 32`)
- [ ] CORS configured for production domains
- [ ] SSL/TLS enabled on all endpoints
- [ ] Admin panel deployed and pointing to production API
- [ ] Mobile app API URL updated to production
- [ ] Mobile app built and submitted to app stores
- [ ] Database backups configured (automated daily)
- [ ] PM2 or container health checks enabled
- [ ] Error monitoring configured (Sentry recommended)
- [ ] Log management configured (CloudWatch / Datadog)

---

## 7. Quick Deploy (Development Demo)

For a quick demo environment using Railway + Vercel:

```bash
# 1. Backend on Railway
# - Connect GitHub repo, set root to packages/backend
# - Add MySQL plugin (Railway provides a free MySQL instance)
# - Set env vars, deploy

# 2. Admin on Vercel
# - Import repo, set root to packages/admin-panel
# - Set NEXT_PUBLIC_API_URL to Railway URL
# - Deploy

# 3. Mobile via Expo Go
# - Update API_BASE_URL to Railway URL
# - Run: npx expo start
# - Scan QR code with Expo Go app
```

Total time: ~15 minutes for a fully working demo.
