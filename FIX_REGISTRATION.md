# 🔧 Fix Registration Issue - Quick Guide

## Problem: Registration Failing

### ✅ Solution Steps:

### 1️⃣ Add Secret Code to Render (5 minutes)

**Go to Render:**
1. Visit: https://dashboard.render.com
2. Click on your **backend service**
3. Click **Environment** tab on the left
4. Click **Add Environment Variable** button
5. Add:
   - **Key:** `ADMIN_SECRET_CODE`
   - **Value:** `CAMPUSSPHERE_ADMIN_2026`
6. Click **Save Changes**
7. **Wait 5-10 minutes** for Render to redeploy

### 2️⃣ Test Registration

**After Render redeploys, test:**

#### **For Faculty/Student (No Secret Code):**
1. Go to your Vercel URL
2. Select "Faculty" or "Student"
3. Click "Register" tab
4. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: test123
   - Confirm: test123
5. Click "Create Account"
6. Should work! ✅

#### **For Admin/Accountant (Needs Secret Code):**
1. Go to your Vercel URL
2. Select "Admin" or "Accountant"
3. Click "Register" tab
4. Fill in all fields
5. **Secret Code:** `CAMPUSSPHERE_ADMIN_2026`
6. Click "Create Account"
7. Should work! ✅

### 3️⃣ If Still Failing

**Check Backend Logs:**
1. Go to Render Dashboard
2. Select your service
3. Click **Logs** tab
4. Look for errors

**Common Errors:**

**Error: "Invalid secret code"**
- ✅ Make sure you added `ADMIN_SECRET_CODE` to Render
- ✅ Make sure it's exactly: `CAMPUSSPHERE_ADMIN_2026`
- ✅ Wait for Render to finish redeploying

**Error: "Email already registered"**
- ✅ Use a different email
- ✅ Or login with existing email

**Error: "All fields are required"**
- ✅ Fill in ALL fields
- ✅ For Admin/Accountant, include secret code

**Error: "Passwords do not match"**
- ✅ Make sure password and confirm password are the same

**Error: "Password must be at least 6 characters"**
- ✅ Use a password with 6+ characters

### 4️⃣ Check Frontend Console

**Open Browser Console:**
1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Try registering again
4. Look for error messages

**Common Issues:**

**"Network Error" or "Failed to fetch"**
- ✅ Check if backend is running on Render
- ✅ Check `VITE_API_URL` in Vercel settings
- ✅ Make sure it's: `https://your-backend.onrender.com`

**CORS Error**
- ✅ Check `CLIENT_URL` in Render
- ✅ Make sure it matches your Vercel URL exactly
- ✅ No trailing slash!

### 5️⃣ Verify Environment Variables

**Render (Backend) should have:**
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026  ← ADD THIS!
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Vercel (Frontend) should have:**
```env
VITE_API_URL=https://your-backend.onrender.com
```

### 6️⃣ Test Backend Directly

**Test if backend is working:**

Open this URL in browser:
```
https://your-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "CampusSphere ERP API is running"
}
```

If it doesn't work:
- ✅ Backend is not deployed
- ✅ Check Render deployment status
- ✅ Check Render logs for errors

### 7️⃣ Alternative: Use Sample Accounts

**Instead of registering, use pre-seeded accounts:**

First, seed the database:
1. Render Dashboard → Your Service → **Shell** tab
2. Run: `npm run seed`
3. Wait for completion

Then login with:
- **Admin:** admin@campussphere.com / admin123
- **Faculty:** john.smith@campussphere.com / faculty123
- **Student:** alice.williams@campussphere.com / student123
- **Accountant:** accountant@campussphere.com / accountant123

## 🎯 Quick Checklist

- [ ] Added `ADMIN_SECRET_CODE` to Render
- [ ] Waited for Render to redeploy (5-10 min)
- [ ] Verified backend health endpoint works
- [ ] Checked browser console for errors
- [ ] Verified `VITE_API_URL` in Vercel
- [ ] Verified `CLIENT_URL` in Render
- [ ] Tried registering as Faculty/Student (no secret code)
- [ ] Tried registering as Admin with secret code

## 🆘 Still Not Working?

**Share these details:**
1. Which role are you trying to register? (Admin/Faculty/Student/Accountant)
2. What error message do you see?
3. What do Render logs show?
4. What does browser console show?
5. Does the health endpoint work?

---

**Most Common Fix:** Just add `ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026` to Render and wait for redeploy! 🚀
