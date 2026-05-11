# CampusSphere ERP - Run Commands Reference

Quick reference for all commands needed to run and manage CampusSphere ERP.

## 🚀 First Time Setup

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment

**Backend (.env):**
```bash
cd server
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux
```

Edit `server/.env` with your MongoDB URI and secrets.

**Frontend (.env):**
```bash
cd client
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux
```

Edit `client/.env` with your API URL.

### 3. Seed Database

```bash
cd server
npm run seed
```

## 🏃 Running the Application

### Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
App runs at: http://localhost:5173

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📦 Package Management

### Install New Package

**Backend:**
```bash
cd server
npm install package-name
```

**Frontend:**
```bash
cd client
npm install package-name
```

### Update Packages

**Check outdated:**
```bash
npm outdated
```

**Update all:**
```bash
npm update
```

**Update specific:**
```bash
npm install package-name@latest
```

### Remove Package

```bash
npm uninstall package-name
```

## 🗄️ Database Commands

### Seed Database
```bash
cd server
npm run seed
```

### Reset Database
1. Drop database in MongoDB Atlas or Compass
2. Run seed again:
```bash
npm run seed
```

### Backup Database
Use MongoDB Atlas dashboard or:
```bash
mongodump --uri="your-connection-string"
```

### Restore Database
```bash
mongorestore --uri="your-connection-string" dump/
```

## 🧹 Cleaning Commands

### Clear Node Modules

**Windows:**
```bash
cd server
rmdir /s /q node_modules
del package-lock.json
npm install

cd ../client
rmdir /s /q node_modules
del package-lock.json
npm install
```

**Mac/Linux:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Clear Build Files

**Frontend:**
```bash
cd client
rm -rf dist    # Mac/Linux
rmdir /s dist  # Windows
```

### Clear Cache

```bash
npm cache clean --force
```

## 🔍 Debugging Commands

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### List Installed Packages
```bash
npm list
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

## 🧪 Testing Commands

### Run Tests (if configured)
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test
```bash
npm test -- filename
```

## 📊 Build Commands

### Frontend Production Build
```bash
cd client
npm run build
```

### Preview Production Build
```bash
cd client
npm run preview
```

### Analyze Bundle Size
```bash
cd client
npm run build -- --analyze
```

## 🔧 Utility Commands

### Format Code (if Prettier configured)
```bash
npm run format
```

### Lint Code (if ESLint configured)
```bash
npm run lint
```

### Fix Lint Issues
```bash
npm run lint -- --fix
```

## 🐛 Troubleshooting Commands

### Kill Process on Port (if port in use)

**Windows:**
```bash
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

### Check if Port is in Use

**Windows:**
```bash
netstat -ano | findstr :5000
```

**Mac/Linux:**
```bash
lsof -i :5000
```

### View Running Processes
```bash
ps aux | grep node    # Mac/Linux
tasklist | findstr node    # Windows
```

## 🔄 Git Commands

### Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### Create Branch
```bash
git checkout -b feature/feature-name
```

### Commit Changes
```bash
git add .
git commit -m "Your commit message"
```

### Push to Remote
```bash
git push origin branch-name
```

### Pull Latest Changes
```bash
git pull origin main
```

### View Status
```bash
git status
```

### View Commit History
```bash
git log --oneline
```

## 📝 Environment Variables

### View Environment Variables

**Windows:**
```bash
echo %MONGO_URI%
```

**Mac/Linux:**
```bash
echo $MONGO_URI
```

### Set Environment Variable (Temporary)

**Windows:**
```bash
set MONGO_URI=your-value
```

**Mac/Linux:**
```bash
export MONGO_URI=your-value
```

## 🚀 Deployment Commands

### Deploy to Vercel (Frontend)
```bash
cd client
npm install -g vercel
vercel login
vercel
```

### Deploy to Render (Backend)
- Push to GitHub
- Connect repository in Render dashboard
- Auto-deploys on push

### Deploy to Netlify (Frontend)
```bash
cd client
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## 📊 Monitoring Commands

### View Backend Logs
```bash
cd server
npm run dev
# Logs appear in terminal
```

### View Frontend Logs
```bash
cd client
npm run dev
# Logs appear in terminal and browser console
```

### Check Server Health
```bash
curl http://localhost:5000/api/health
```

## 🔐 Security Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Random Password
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## 📦 Quick Command Reference

| Task | Command |
|------|---------|
| Install backend deps | `cd server && npm install` |
| Install frontend deps | `cd client && npm install` |
| Run backend dev | `cd server && npm run dev` |
| Run frontend dev | `cd client && npm run dev` |
| Seed database | `cd server && npm run seed` |
| Build frontend | `cd client && npm run build` |
| Start backend prod | `cd server && npm start` |
| Preview frontend | `cd client && npm run preview` |
| Check outdated | `npm outdated` |
| Update packages | `npm update` |
| Clear cache | `npm cache clean --force` |
| Check vulnerabilities | `npm audit` |
| Fix vulnerabilities | `npm audit fix` |

## 🎯 Common Workflows

### Starting Fresh Development Session
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

### After Pulling New Code
```bash
# Backend
cd server
npm install
npm run seed  # if database schema changed

# Frontend
cd client
npm install
```

### Before Committing
```bash
# Check for errors
npm run lint  # if configured
npm test      # if configured

# Commit
git add .
git commit -m "Your message"
git push
```

### Preparing for Deployment
```bash
# Test production build
cd client
npm run build
npm run preview

# Test backend
cd server
npm start
```

## 🆘 Emergency Commands

### Server Won't Start
```bash
# Clear everything and reinstall
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend Won't Start
```bash
# Clear everything and reinstall
cd client
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

### Database Connection Issues
```bash
# Re-seed database
cd server
npm run seed
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows (then taskkill)
```

## 📚 Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

**Pro Tip**: Create aliases for frequently used commands in your shell configuration file (.bashrc, .zshrc, etc.):

```bash
alias server="cd ~/path/to/TrackSphere/server && npm run dev"
alias client="cd ~/path/to/TrackSphere/client && npm run dev"
alias seed="cd ~/path/to/TrackSphere/server && npm run seed"
```

Then you can just type `server`, `client`, or `seed` from anywhere!
