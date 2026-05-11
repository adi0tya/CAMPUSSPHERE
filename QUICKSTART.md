# CampusSphere ERP - Quick Start Guide

Get CampusSphere ERP running on your local machine in 5 minutes!

## 📋 Prerequisites

- Node.js v16 or higher ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- Git ([Download](https://git-scm.com/))
- Code editor (VS Code recommended)

## 🚀 Quick Setup

### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd TrackSphere
```

### Step 2: Setup MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create database user
4. Whitelist your IP (or use 0.0.0.0/0 for testing)
5. Get connection string

### Step 3: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

Edit `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campussphere
JWT_SECRET=your_super_secret_jwt_key_here_change_this
ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

✅ Backend running at http://localhost:5000

### Step 4: Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start development server
npm run dev
```

✅ Frontend running at http://localhost:5173

## 🎉 You're Ready!

Open http://localhost:5173 in your browser.

### Sample Login Credentials

After running `npm run seed`, use these credentials:

**Admin:**
- Email: `admin@campussphere.com`
- Password: `admin123`

**Faculty:**
- Email: `john.smith@campussphere.com`
- Password: `faculty123`

**Student:**
- Email: `alice.williams@campussphere.com`
- Password: `student123`

**Accountant:**
- Email: `accountant@campussphere.com`
- Password: `accountant123`

## 📱 Testing the App

1. **Select Role**: Choose Admin, Faculty, Student, or Accountant
2. **Login**: Use credentials above
3. **Explore**: Navigate through the dashboard and features

## 🔧 Common Issues

### "Cannot connect to MongoDB"
- Check your connection string in `.env`
- Verify IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

### "Port already in use"
- Change PORT in `server/.env` to 5001 or another available port
- Kill the process using the port

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

### "CORS Error"
- Verify `CLIENT_URL` in `server/.env` matches your frontend URL
- Check `VITE_API_URL` in `client/.env` matches your backend URL

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Review [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) before going live

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed information
- Review error messages in terminal
- Check browser console for frontend errors
- Verify all environment variables are set correctly

## 🎯 Development Workflow

### Making Changes

**Backend:**
- Edit files in `server/` directory
- Server auto-restarts (nodemon)
- Check terminal for errors

**Frontend:**
- Edit files in `client/src/` directory
- Browser auto-refreshes (Vite HMR)
- Check browser console for errors

### Adding New Features

1. Create/modify models in `server/models/`
2. Create/modify controllers in `server/controllers/`
3. Create/modify routes in `server/routes/`
4. Create/modify components in `client/src/components/`
5. Create/modify pages in `client/src/pages/`
6. Test thoroughly
7. Commit changes

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to repository
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 🔄 Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Or update specific package
npm install package-name@latest
```

## 🧹 Cleaning Up

```bash
# Remove node_modules
rm -rf node_modules    # Mac/Linux
rmdir /s node_modules  # Windows

# Remove package-lock.json
rm package-lock.json    # Mac/Linux
del package-lock.json   # Windows

# Reinstall
npm install
```

## 📊 Database Management

### Reset Database
```bash
cd server
npm run seed
```

### Backup Database
Use MongoDB Atlas:
1. Go to your cluster
2. Click "..." → "Backup"
3. Configure backup schedule

### View Database
Use MongoDB Compass:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Browse collections

## 🎨 Customization

### Change Theme Colors
Edit `client/src/index.css`:
- Background: `#000000`
- Cards: `#111111`, `#181818`
- Borders: `#2a2a2a`
- Accents: Modify gradient classes

### Change App Name
1. Update `client/index.html` title
2. Update `client/src/components/common/Sidebar.jsx` logo text
3. Update `server/server.js` console messages
4. Update README.md

### Add New Role
1. Update `server/models/User.js` role enum
2. Update `client/src/context/AuthContext.jsx` ROLE_DASHBOARDS
3. Create new layout in `client/src/layouts/`
4. Create new pages in `client/src/pages/`
5. Update `client/src/App.jsx` routes

## 🚀 Performance Tips

### Development
- Use React DevTools for debugging
- Use MongoDB Compass for database queries
- Use Postman for API testing
- Enable source maps

### Production
- Run `npm run build` to test production build
- Check bundle size
- Optimize images
- Enable compression

## 📝 Code Style

### Backend
- Use async/await for asynchronous operations
- Use try-catch for error handling
- Follow RESTful API conventions
- Add comments for complex logic

### Frontend
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names
- Follow React best practices

## ✅ Before Committing

- [ ] Code runs without errors
- [ ] No console warnings
- [ ] Code formatted properly
- [ ] Comments added where needed
- [ ] Tested on different screen sizes
- [ ] Git commit message is descriptive

---

**Happy Coding! 🎓**

For detailed documentation, see [README.md](README.md)
