# 🚀 CampusSphere ERP - Deployment Verification Guide

## ✅ Step 1: Verify Backend is Running

### Check Render Dashboard
1. Go to your Render dashboard
2. Find your backend service
3. Check status should be **"Live"** (green)
4. Check logs for: `🎓 CampusSphere ERP server running on port 5000`

### Test Health Endpoint
Open in browser or use curl:
```
https://[your-render-url].onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "CampusSphere ERP API is running"
}
```

If this fails, backend is not accessible!

---

## ✅ Step 2: Verify Environment Variables on Render

Make sure these are set in Render dashboard:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key |
| `ADMIN_SECRET_CODE` | `CAMPUSSPHERE_ADMIN_2026` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://tracksphere-orcin.vercel.app` |
| `PORT` | `5000` (or leave empty, Render auto-assigns) |

---

## ✅ Step 3: Verify Frontend Environment on Vercel

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify `VITE_API_URL` is set to your Render backend URL:
   ```
   https://[your-render-url].onrender.com
   ```
5. If you changed it, **redeploy** the frontend

---

## ✅ Step 4: Test Authentication

### Test Registration (Student - No Secret Code)
1. Go to: `https://tracksphere-orcin.vercel.app`
2. Click **"Get Started"** or **"Continue as Student"**
3. Click **"Register"**
4. Fill in:
   - Name: Test Student
   - Email: student@test.com
   - Phone: 1234567890
   - Password: test123
   - Confirm Password: test123
   - Role: Student
5. Click **Register**

**Expected:** Success message + redirect to student dashboard

### Test Registration (Admin - With Secret Code)
1. Click **"Continue as Admin"**
2. Click **"Register"**
3. Fill in:
   - Name: Test Admin
   - Email: admin@test.com
   - Phone: 9876543210
   - Password: admin123
   - Confirm Password: admin123
   - Role: Admin
   - Secret Code: `CAMPUSSPHERE_ADMIN_2026`
4. Click **Register**

**Expected:** Success message + redirect to admin dashboard

### Test Login
1. Logout if logged in
2. Click **"Login"**
3. Enter credentials from above
4. Select correct role
5. Click **Login**

**Expected:** Success + redirect to role-specific dashboard

---

## ✅ Step 5: Seed Database (Optional but Recommended)

If you want sample data for testing:

1. Go to Render dashboard
2. Open your backend service
3. Click **"Shell"** tab
4. Run:
   ```bash
   npm run seed
   ```

This will create:
- 1 Admin user
- 2 Faculty members
- 5 Students
- 3 Courses
- 6 Subjects
- Sample notices, fees, assignments

**Default Login Credentials:**
- Admin: `admin@campussphere.edu` / `admin123`
- Faculty: `john.doe@campussphere.edu` / `faculty123`
- Student: `alice.smith@campussphere.edu` / `student123`

---

## 🔍 Common Issues & Solutions

### Issue 1: "Failed to fetch" Error
**Cause:** Backend not accessible
**Solution:**
- Check Render service is "Live"
- Test health endpoint
- Check Render logs for errors
- Verify MongoDB connection string is correct

### Issue 2: "Registration Failed" with no error message
**Cause:** CORS or network issue
**Solution:**
- Check `CLIENT_URL` in Render matches your Vercel URL exactly
- Check browser console for CORS errors
- Redeploy backend after changing environment variables

### Issue 3: "Invalid secret code" for Admin/Accountant
**Cause:** Secret code mismatch
**Solution:**
- Verify `ADMIN_SECRET_CODE` in Render is: `CAMPUSSPHERE_ADMIN_2026`
- Use exact code when registering (case-sensitive)

### Issue 4: "Email already registered"
**Cause:** User already exists in database
**Solution:**
- Use different email
- Or delete user from MongoDB Atlas
- Or use login instead of register

### Issue 5: Login works but redirects to wrong page
**Cause:** Role mismatch
**Solution:**
- Make sure you select the correct role during login
- Role must match the role you registered with

---

## 📊 Render Logs to Check

Good logs should show:
```
✅ MongoDB connected successfully
🎓 CampusSphere ERP server running on port 5000
📡 Environment: production
🌐 CORS enabled for: https://tracksphere-orcin.vercel.app
✅ Server is ready to accept connections
```

Bad logs might show:
```
❌ MongoDB connection failed: [error]
❌ Error: connect ECONNREFUSED
❌ MongooseServerSelectionError
```

---

## 🎯 Quick Test Checklist

- [ ] Backend health endpoint returns OK
- [ ] Render logs show "Server is ready"
- [ ] MongoDB connected successfully
- [ ] Student registration works (no secret code)
- [ ] Faculty registration works (no secret code)
- [ ] Admin registration works (with secret code)
- [ ] Accountant registration works (with secret code)
- [ ] Login works for all roles
- [ ] Redirects to correct dashboard after login
- [ ] Logout works
- [ ] Token persists on page refresh

---

## 🆘 Still Not Working?

1. **Check Render Logs:**
   - Go to Render dashboard → Your service → Logs tab
   - Look for error messages

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red errors

3. **Check Network Tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try to register/login
   - Click on failed request
   - Check Response tab for error details

4. **Verify MongoDB:**
   - Go to MongoDB Atlas
   - Check if database exists
   - Check if collections are created
   - Verify connection string is correct

---

## 📝 Notes

- First request to Render might be slow (cold start ~30 seconds)
- Subsequent requests should be fast
- If backend was sleeping, wait 30-60 seconds after deployment
- Always check Render logs first when debugging
- CORS errors mean `CLIENT_URL` doesn't match your Vercel URL

---

**Once everything works, you can delete this file!**
