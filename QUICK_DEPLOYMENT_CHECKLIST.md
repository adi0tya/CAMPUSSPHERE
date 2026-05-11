# 🚀 Quick Deployment Update Checklist

Your code is pushed to GitHub. Now update your deployed apps:

## ⚡ Quick Steps (10 minutes)

### 1️⃣ Render (Backend) - 5 minutes

1. **Go to:** https://dashboard.render.com
2. **Select** your backend service
3. **Click** "Environment" tab
4. **Verify/Add** these variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026
   CLIENT_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```
5. **Click** "Manual Deploy" → "Deploy latest commit"
6. **Wait** for deployment (5-10 min)
7. **Test:** Visit `https://your-backend.onrender.com/api/health`

### 2️⃣ Vercel (Frontend) - 3 minutes

1. **Go to:** https://vercel.com/dashboard
2. **Select** your project
3. **Click** Settings → Environment Variables
4. **Verify:**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. **Go to** Deployments tab
6. **Click** "..." on latest → "Redeploy"
7. **Wait** for deployment (2-5 min)
8. **Test:** Visit your Vercel URL

### 3️⃣ Seed Database - 2 minutes

**Option A: Via Render Shell**
1. Render Dashboard → Your Service → Shell
2. Run: `npm run seed`

**Option B: Locally**
1. Update local `server/.env` with production MongoDB URI
2. Run: `cd server && npm run seed`

### 4️⃣ Test Everything - 5 minutes

Visit your Vercel URL and test:
- [ ] Role selection page loads
- [ ] Login as Admin: `admin@campussphere.com` / `admin123`
- [ ] Dashboard shows stats
- [ ] Navigate to Students page
- [ ] No console errors
- [ ] API calls work

## ✅ Success Indicators

**Backend (Render):**
- ✅ Logs show: "🎓 CampusSphere ERP server running"
- ✅ Health endpoint returns: `{"status":"OK"}`
- ✅ No error logs

**Frontend (Vercel):**
- ✅ Build successful
- ✅ Role selection page loads
- ✅ Can login
- ✅ Dashboard loads
- ✅ No CORS errors

**Database:**
- ✅ Seed script completed
- ✅ Sample users exist
- ✅ Can login with sample credentials

## 🐛 Quick Fixes

**CORS Error?**
→ Update `CLIENT_URL` in Render to exact Vercel URL (no trailing slash)

**Can't login?**
→ Run seed script on production database

**Backend not responding?**
→ Check Render logs, might be spinning up (free tier)

**Frontend shows blank?**
→ Check browser console, verify `VITE_API_URL` in Vercel

## 📱 Your URLs

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-backend.onrender.com`
**Health Check:** `https://your-backend.onrender.com/api/health`

## 🎯 Sample Credentials (After Seeding)

- **Admin:** admin@campussphere.com / admin123
- **Faculty:** john.smith@campussphere.com / faculty123
- **Student:** alice.williams@campussphere.com / student123
- **Accountant:** accountant@campussphere.com / accountant123

---

**That's it! Your CampusSphere ERP should be live! 🎉**

For detailed troubleshooting, see `DEPLOYMENT_UPDATE.md`
