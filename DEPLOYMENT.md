# CampusSphere ERP - Deployment Guide

## 📋 Pre-Deployment Checklist

### Backend Preparation
- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created and configured
- [ ] Database connection string tested
- [ ] JWT secret generated (use strong random string)
- [ ] Admin secret code set
- [ ] CORS origins configured for production
- [ ] File upload limits configured
- [ ] Error handling tested

### Frontend Preparation
- [ ] API URL configured for production
- [ ] Build tested locally (`npm run build`)
- [ ] All routes tested
- [ ] Responsive design verified
- [ ] Browser compatibility checked
- [ ] Assets optimized

## 🚀 Deployment Steps

### 1. MongoDB Atlas Setup

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to your users
   - Name your cluster (e.g., "campussphere")

3. **Configure Security**
   - Database Access → Add Database User
   - Username: `campussphere_admin`
   - Password: Generate secure password
   - Role: Atlas admin or Read/Write to any database

4. **Network Access**
   - Network Access → Add IP Address
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allow from anywhere)
   - Note: This is less secure but necessary for cloud deployments

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `campussphere`

### 2. Backend Deployment (Render)

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `campussphere-api`
     - **Region**: Choose closest to your users
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campussphere
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
   ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://campussphere-api.onrender.com`

### 3. Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://campussphere-api.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

5. **Update Backend CORS**
   - Go back to Render
   - Update `CLIENT_URL` environment variable with your Vercel URL
   - Redeploy backend

### 4. Alternative: Backend on Railway

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Root directory: `server`
   - Start command: `npm start`
   - Add environment variables (same as Render)

4. **Deploy**
   - Railway will auto-deploy
   - Get your URL from settings

### 5. Alternative: Frontend on Netlify

1. **Create Netlify Account**
   - Go to [Netlify](https://netlify.com)
   - Sign up with GitHub

2. **New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select repository

3. **Configure**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - Add environment variable: `VITE_API_URL`

4. **Deploy**
   - Click "Deploy site"

## 🔧 Post-Deployment Configuration

### 1. Seed Database
```bash
# SSH into your backend server or run locally with production DB
npm run seed
```

### 2. Test All Endpoints
Use Postman or similar:
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] GET /api/auth/me
- [ ] GET /api/students
- [ ] GET /api/faculty
- [ ] GET /api/courses
- [ ] GET /api/notices
- [ ] GET /api/reports/overview

### 3. Test Frontend
- [ ] Visit your Vercel URL
- [ ] Test role selection
- [ ] Test login for each role
- [ ] Test navigation
- [ ] Test CRUD operations
- [ ] Test file uploads
- [ ] Test responsive design

### 4. Configure Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render:**
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

## 🔒 Security Checklist

- [ ] Strong JWT secret (minimum 32 characters)
- [ ] Secure admin secret code
- [ ] MongoDB user has limited permissions
- [ ] CORS configured for specific origins only
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables not committed to Git
- [ ] Rate limiting configured (optional)
- [ ] Input validation on all endpoints
- [ ] File upload size limits set
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection (React default)

## 📊 Monitoring

### Render
- View logs in dashboard
- Set up health checks
- Monitor resource usage

### Vercel
- View deployment logs
- Analytics available
- Error tracking

### MongoDB Atlas
- Monitor database performance
- Set up alerts
- View connection metrics

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check connection string
- Verify IP whitelist in Atlas
- Check database user credentials

**"CORS Error"**
- Verify CLIENT_URL in backend .env
- Check CORS configuration in server.js
- Ensure frontend URL is correct

**"Module not found"**
- Run `npm install` in server directory
- Check package.json dependencies
- Clear node_modules and reinstall

### Frontend Issues

**"API calls failing"**
- Check VITE_API_URL environment variable
- Verify backend is running
- Check browser console for errors
- Verify CORS configuration

**"Build fails"**
- Check for TypeScript errors
- Verify all imports are correct
- Check for missing dependencies
- Review build logs

**"Blank page after deployment"**
- Check browser console
- Verify build output directory
- Check routing configuration
- Ensure environment variables are set

### Database Issues

**"Slow queries"**
- Add indexes to frequently queried fields
- Check MongoDB Atlas performance metrics
- Optimize query patterns

**"Connection timeout"**
- Check network access in Atlas
- Verify connection string
- Check if cluster is paused (free tier)

## 🔄 Continuous Deployment

### Automatic Deployment
Both Vercel and Render support automatic deployment:
- Push to `main` branch → Auto-deploy
- Push to `dev` branch → Deploy to staging (configure separately)

### Manual Deployment
- Render: Click "Manual Deploy" → "Deploy latest commit"
- Vercel: Deployments are automatic, but you can redeploy from dashboard

## 📈 Scaling

### Free Tier Limitations
- **Render**: Spins down after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth/month
- **MongoDB Atlas**: 512MB storage

### Upgrade Path
1. **Render**: Upgrade to Starter ($7/month) for always-on
2. **Vercel**: Pro plan ($20/month) for more bandwidth
3. **MongoDB**: Shared cluster ($9/month) for more storage

## 🎯 Performance Optimization

### Backend
- Enable compression middleware
- Implement caching (Redis)
- Optimize database queries
- Use CDN for static files

### Frontend
- Code splitting
- Lazy loading routes
- Image optimization
- Bundle size optimization

## 📝 Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check database size monthly
- [ ] Update dependencies quarterly
- [ ] Backup database monthly
- [ ] Review security quarterly
- [ ] Performance audit quarterly

### Backup Strategy
1. **MongoDB Atlas**: Enable automatic backups
2. **Code**: Keep Git repository updated
3. **Environment Variables**: Store securely (1Password, etc.)

## 🆘 Support

### Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)

### Getting Help
- Check application logs first
- Review this deployment guide
- Search Stack Overflow
- Check GitHub issues
- Contact support (Render/Vercel/MongoDB)

---

**Last Updated**: May 2026
**Version**: 1.0.0
