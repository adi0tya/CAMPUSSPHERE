# CampusSphere ERP - Deployment Update Guide

## 🚨 IMPORTANT: Update Your Deployed Environment Variables

Since you've transformed TrackSphere to CampusSphere ERP, you need to update environment variables on your deployed platforms.

## 🔧 Render (Backend) Updates

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Select your backend service

### 2. Update Environment Variables
Go to **Environment** tab and ensure these variables are set:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campussphere
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Important Changes:**
- ✅ Verify `CLIENT_URL` points to your Vercel frontend URL
- ✅ Ensure `ADMIN_SECRET_CODE` is set (required for admin/accountant registration)
- ✅ Database name should be `campussphere` (or your preferred name)

### 3. Trigger Manual Deploy (if needed)
- Click **Manual Deploy** → **Deploy latest commit**
- Wait for deployment to complete (5-10 minutes)

### 4. Check Deployment Logs
- Look for: `🎓 CampusSphere ERP server running on port 5000`
- Check for any errors

### 5. Test Backend Health
Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "CampusSphere ERP API is running"
}
```

## 🌐 Vercel (Frontend) Updates

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project

### 2. Update Environment Variables
Go to **Settings** → **Environment Variables**

Ensure this variable is set:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Important:**
- ✅ Remove `http://` if you accidentally added it
- ✅ Use `https://` for production
- ✅ No trailing slash at the end

### 3. Redeploy
- Go to **Deployments** tab
- Click **...** on latest deployment
- Click **Redeploy**
- Check "Use existing Build Cache" (optional)
- Click **Redeploy**

### 4. Check Deployment
- Wait for deployment to complete (2-5 minutes)
- Visit your Vercel URL
- Should see CampusSphere ERP role selection page

## 🗄️ Database Updates

### 1. Seed Production Database

**Option A: Using Render Shell**
1. Go to Render dashboard
2. Select your service
3. Click **Shell** tab
4. Run:
```bash
npm run seed
```

**Option B: Using Local Connection**
1. Update your local `server/.env` with production MongoDB URI
2. Run locally:
```bash
cd server
npm run seed
```
3. Revert `.env` back to development settings

### 2. Verify Database
- Check MongoDB Atlas dashboard
- Should see new collections:
  - users
  - students
  - faculties
  - courses
  - subjects
  - attendances
  - notices
  - fees
  - assignments
  - submissions
  - timetables
  - notifications

## ✅ Post-Deployment Verification

### 1. Test Backend Endpoints

**Health Check:**
```bash
curl https://your-backend-url.onrender.com/api/health
```

**Test Login:**
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@campussphere.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Should return a token and user object.

### 2. Test Frontend

Visit your Vercel URL and test:
- ✅ Role selection page loads
- ✅ Can navigate to login pages
- ✅ Can login with sample credentials
- ✅ Dashboard loads correctly
- ✅ No console errors
- ✅ API calls work (check Network tab)

### 3. Test All Roles

**Admin:**
- Email: `admin@campussphere.com`
- Password: `admin123`
- Test: View dashboard, manage students

**Faculty:**
- Email: `john.smith@campussphere.com`
- Password: `faculty123`
- Test: View subjects, mark attendance

**Student:**
- Email: `alice.williams@campussphere.com`
- Password: `student123`
- Test: View attendance, assignments

**Accountant:**
- Email: `accountant@campussphere.com`
- Password: `accountant123`
- Test: View fee dashboard

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Check:**
1. Verify `VITE_API_URL` in Vercel is correct
2. Check Render service is running
3. Check Render logs for errors
4. Verify CORS settings in backend

**Fix:**
- Update `CLIENT_URL` in Render to match Vercel URL
- Redeploy backend

### Issue: "Invalid credentials" for all users

**Check:**
1. Database was seeded
2. MongoDB connection is working
3. Check Render logs

**Fix:**
- Run seed script on production database
- Check MongoDB Atlas network access

### Issue: "CORS Error"

**Check:**
1. `CLIENT_URL` in Render matches Vercel URL exactly
2. No trailing slashes
3. Uses `https://`

**Fix:**
```env
CLIENT_URL=https://your-app.vercel.app
```
(No trailing slash!)

### Issue: "Admin registration requires secret code"

**This is correct!** Admin and Accountant roles require secret code.

**Secret Code:** `CAMPUSSPHERE_ADMIN_2026`

Or register as Faculty/Student (no secret code needed).

### Issue: Render service keeps spinning down

**Free tier limitation:**
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds

**Solutions:**
1. Upgrade to paid plan ($7/month)
2. Use a service like UptimeRobot to ping every 14 minutes
3. Accept the limitation for development

## 📊 Monitoring

### Render Logs
- Go to Render dashboard
- Select service
- Click **Logs** tab
- Monitor for errors

### Vercel Logs
- Go to Vercel dashboard
- Select project
- Click **Deployments**
- Click on deployment
- View **Build Logs** and **Function Logs**

### MongoDB Atlas
- Go to MongoDB Atlas
- Select cluster
- Click **Metrics**
- Monitor connections and operations

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is strong (32+ characters)
- [ ] `ADMIN_SECRET_CODE` is set
- [ ] MongoDB user has limited permissions
- [ ] MongoDB network access configured
- [ ] CORS configured for specific origin only
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables not exposed in frontend

## 🎯 Performance Optimization

### Render (Backend)
- [ ] Enable compression middleware (already in code)
- [ ] Add database indexes (already in models)
- [ ] Monitor response times
- [ ] Consider upgrading if slow

### Vercel (Frontend)
- [ ] Build is optimized (Vite does this)
- [ ] Images are optimized
- [ ] Code splitting enabled
- [ ] Check bundle size

## 📝 Deployment URLs

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Backend (Render):**
```
https://your-backend.onrender.com
```

**MongoDB Atlas:**
```
mongodb+srv://cluster.mongodb.net/campussphere
```

## 🔄 Future Deployments

### Automatic Deployment
- Push to `main` branch → Auto-deploys to both platforms
- Vercel: ~2 minutes
- Render: ~5-10 minutes

### Manual Deployment
**Render:**
- Dashboard → Manual Deploy → Deploy latest commit

**Vercel:**
- Dashboard → Deployments → Redeploy

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

## ✅ Final Checklist

- [ ] Render environment variables updated
- [ ] Vercel environment variables updated
- [ ] Backend redeployed
- [ ] Frontend redeployed
- [ ] Production database seeded
- [ ] Health endpoint working
- [ ] Login working for all roles
- [ ] No CORS errors
- [ ] No console errors
- [ ] All features tested

---

**Once all checkboxes are complete, your CampusSphere ERP is live! 🎉**

**Need help?** Check the logs first, then review this guide.
