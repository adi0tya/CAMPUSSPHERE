# 🔍 Debug Authentication Issues

## 🚨 **What's the exact error?**

Please tell me:
1. **Which role** are you trying? (Admin/Faculty/Student/Accountant)
2. **Login or Register?**
3. **What error message** do you see?
4. **What happens?** (Nothing? Error toast? Page refresh?)

---

## 🧪 **Step-by-Step Debugging:**

### **Step 1: Check if Backend is Running**

Open this URL in your browser:
```
https://your-backend.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "CampusSphere ERP API is running"
}
```

**If it doesn't work:**
- ❌ Backend is down or not deployed
- Go to Render dashboard and check deployment status

---

### **Step 2: Check Browser Console**

1. Press `F12` (or right-click → Inspect)
2. Go to **Console** tab
3. Try logging in or registering
4. Look for errors

**Common Errors:**

**"Network Error" or "ERR_CONNECTION_REFUSED"**
- Backend is not running
- Wrong API URL in Vercel

**"CORS Error"**
- Wrong CLIENT_URL in Render
- Should be: `https://tracksphere-orcin.vercel.app`

**"401 Unauthorized"**
- Wrong email or password
- Or wrong role selected

**"403 Forbidden"**
- Wrong secret code (for Admin/Accountant)
- Or account is deactivated

**"400 Bad Request"**
- Missing fields
- Or validation error

---

### **Step 3: Check Network Tab**

1. Press `F12`
2. Go to **Network** tab
3. Try logging in or registering
4. Look for the API call (should be `/api/auth/login` or `/api/auth/register`)
5. Click on it
6. Check **Response** tab

**What to look for:**
- Status code (200 = success, 400/401/403 = error)
- Response message
- Error details

---

### **Step 4: Test Backend Directly**

Use this to test registration (Student - no secret code):

**Open Command Prompt/Terminal and run:**

```bash
curl -X POST https://your-backend.onrender.com/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Student\",\"email\":\"test123@example.com\",\"phone\":\"1234567890\",\"password\":\"test123\",\"confirmPassword\":\"test123\",\"role\":\"student\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

**If this works but frontend doesn't:**
- Problem is in frontend
- Check VITE_API_URL in Vercel

**If this doesn't work:**
- Problem is in backend
- Check Render logs

---

### **Step 5: Check Render Logs**

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Click **"Logs"** tab
4. Try registering/logging in
5. Look for error messages

**What to look for:**

```
ADMIN_SECRET_CODE not configured
```
→ Add the environment variable

```
Registration error: ...
```
→ Shows the actual error

```
MongoServerError: ...
```
→ Database connection issue

---

### **Step 6: Verify Environment Variables**

**Render (Backend):**
```
ADMIN_SECRET_CODE = CAMPUSSPHERE_ADMIN_2026
CLIENT_URL = https://tracksphere-orcin.vercel.app
JWT_SECRET = (your secret)
MONGO_URI = (your MongoDB URI)
NODE_ENV = production
PORT = 5000
```

**Vercel (Frontend):**
```
VITE_API_URL = https://your-backend.onrender.com
```

---

## 🎯 **Quick Tests:**

### **Test 1: Register as Student (Easiest)**

1. Go to: https://tracksphere-orcin.vercel.app
2. Click **"Student"**
3. Click **"Register"** tab
4. Fill in:
   ```
   Name: Test Student
   Email: teststudent123@example.com
   Phone: 1234567890
   Password: test123
   Confirm: test123
   ```
5. Click "Create Student Account"

**Expected:** Success, redirects to student dashboard
**If fails:** Check console and network tab

---

### **Test 2: Login with Seeded Account**

First, seed the database:
1. Render Dashboard → Your Service → **Shell**
2. Run: `npm run seed`
3. Wait for completion

Then login:
1. Go to your site
2. Click **"Admin"**
3. Click **"Login"** tab
4. Enter:
   ```
   Email: admin@campussphere.com
   Password: admin123
   ```
5. Click "Sign In"

**Expected:** Success, redirects to admin dashboard
**If fails:** Database not seeded or wrong credentials

---

### **Test 3: Register as Admin (With Secret Code)**

1. Click **"Admin"**
2. Click **"Register"** tab
3. Fill in all fields
4. **Secret Code:** `CAMPUSSPHERE_ADMIN_2026`
5. Click "Create Admin Account"

**Expected:** Success, redirects to admin dashboard
**If fails:** Wrong secret code or not configured in Render

---

## 🔧 **Common Fixes:**

### **Fix 1: Backend Not Responding**

**Check:**
1. Render deployment status
2. Render logs for errors
3. Health endpoint

**Fix:**
- Redeploy on Render
- Check MongoDB connection
- Check environment variables

---

### **Fix 2: CORS Error**

**Check:**
- `CLIENT_URL` in Render

**Fix:**
- Update to: `https://tracksphere-orcin.vercel.app`
- No trailing slash!
- Redeploy backend

---

### **Fix 3: Wrong API URL**

**Check:**
- `VITE_API_URL` in Vercel

**Fix:**
- Update to your Render backend URL
- Redeploy frontend

---

### **Fix 4: Secret Code Not Working**

**Check:**
- `ADMIN_SECRET_CODE` in Render
- Should be: `CAMPUSSPHERE_ADMIN_2026`

**Fix:**
- Add/update in Render
- Redeploy backend
- Wait 5-10 minutes

---

### **Fix 5: Database Not Connected**

**Check:**
- `MONGO_URI` in Render
- MongoDB Atlas network access

**Fix:**
- Verify connection string
- Whitelist IP in MongoDB Atlas (0.0.0.0/0)
- Check database user credentials

---

## 📊 **Checklist:**

- [ ] Backend health endpoint works
- [ ] Render deployment is successful
- [ ] Render logs show no errors
- [ ] `ADMIN_SECRET_CODE` is set in Render
- [ ] `CLIENT_URL` is correct in Render (no trailing slash)
- [ ] `VITE_API_URL` is correct in Vercel
- [ ] MongoDB is connected (check Render logs)
- [ ] Database is seeded (if using seeded accounts)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

---

## 🆘 **Still Not Working?**

**Tell me:**

1. **What role?** (Admin/Faculty/Student/Accountant)
2. **Login or Register?**
3. **Error message?** (exact text)
4. **Console errors?** (screenshot or copy)
5. **Network tab response?** (what does it say)
6. **Render logs?** (any errors)
7. **Health endpoint works?** (yes/no)

**Screenshots help!**
- Browser console
- Network tab
- Error message
- Render logs

---

## 💡 **Most Common Issues:**

1. **Backend not deployed** → Check Render
2. **Wrong secret code** → Use `CAMPUSSPHERE_ADMIN_2026`
3. **CORS error** → Fix `CLIENT_URL` in Render
4. **Database not seeded** → Run `npm run seed` in Render Shell
5. **Wrong API URL** → Fix `VITE_API_URL` in Vercel

---

**Let me know the specific error and I'll help you fix it!** 🚀
