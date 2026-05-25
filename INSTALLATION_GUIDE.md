# NATART Backend - Complete Installation & Setup Guide

## 📋 Prerequisites

- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (Local or Cloud) - [Download](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js)
- Git (optional)

---

## 🚀 Step-by-Step Installation

### Step 1: Install Node.js

**Windows/Mac/Linux:**
1. Download from https://nodejs.org/
2. Install the LTS version
3. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Setup MongoDB

#### Option A: Local MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow setup wizard
3. MongoDB will start automatically

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Verify MongoDB is running:**
```bash
mongosh
# You should see: test>
# Type: exit
```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new project
4. Create cluster (choose free tier)
5. Add database user with username & password
6. Get connection string (looks like):
```
mongodb+srv://username:password@cluster.mongodb.net/natart
```

### Step 3: Extract Backend Project

```bash
# Navigate to extracted natart-backend folder
cd natart-backend

# Install dependencies
npm install
```

This will install all required packages:
- express (web framework)
- mongoose (database)
- socket.io (real-time chat)
- jwt (authentication)
- bcryptjs (password encryption)
- multer (file uploads)
- cors (cross-origin requests)

### Step 4: Configure Environment Variables

Create/Edit `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/natart
JWT_SECRET=your_super_secret_key_choose_strong_one
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natart
```

⚠️ **Important:** 
- Keep `.env` file private (never commit to git)
- Change JWT_SECRET to something unique
- For production, use strong secrets

### Step 5: Start the Server

```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected
```

Open browser and go to: http://localhost:5000
You should see: `{"message":"NATART Backend API is running"}`

---

## 🧪 Testing the API

### Using cURL (Command Line)

#### Test 1: Create Account

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+995577604756",
    "password": "test12345",
    "confirmPassword": "test12345",
    "address": "Tbilisi"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

#### Test 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test12345"
  }'
```

#### Test 3: Get Products

```bash
curl http://localhost:5000/api/products
```

### Using Postman (GUI)

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Set method to POST
4. URL: `http://localhost:5000/api/auth/signup`
5. Go to "Body" → "raw" → "JSON"
6. Paste signup data
7. Click Send

---

## 🔗 Frontend Integration

### Update Frontend API URL

In your frontend (HTML/React/Vue), update API_BASE_URL:

```javascript
// Change from:
const API_BASE_URL = 'http://localhost:5000/api';

// Production:
const API_BASE_URL = 'https://your-domain.com/api';
```

### Sync Cart with Backend

In your frontend `index.html` cart checkout:

```javascript
async function checkout() {
  const { name, email, phone, address } = getUserData();
  const cart = getCart();
  
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      items: cart,
      totalPrice: cartTotal
    })
  });
  
  const result = await response.json();
  if (result.order) {
    console.log('Order created:', result.order.orderNumber);
  }
}
```

---

## 👨‍💼 Creating Admin User

To create an admin account, you need to manually update the database:

### Option 1: Using MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to MongoDB
3. Navigate to: natart → users
4. Insert document:

```json
{
  "name": "Admin User",
  "email": "admin@natart.com",
  "phone": "+995577604756",
  "password": "admin123",
  "address": "Tbilisi",
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

5. Hash the password using bcryptjs:

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('admin123', 10);
console.log(hashedPassword);
```

### Option 2: Using Script

Create `create-admin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const admin = new User({
    name: 'Admin User',
    email: 'admin@natart.com',
    phone: '+995577604756',
    password: 'admin123',
    address: 'Tbilisi',
    role: 'admin'
  });
  
  await admin.save();
  console.log('Admin created successfully!');
  console.log('Email:', admin.email);
  console.log('Password: admin123');
  
  mongoose.connection.close();
}

createAdmin();
```

Run:
```bash
node create-admin.js
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Make sure MongoDB is running:
```bash
# Mac:
brew services list

# Windows:
# Open Services and check if MongoDB is running

# Linux:
sudo systemctl status mongodb
```

2. Check connection string in `.env`
3. For Atlas, check IP whitelist (allow all for development)

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill the process (replace 12345 with actual PID)
kill -9 12345

# Or change port in .env
PORT=5001
```

### JWT Token Errors

**Error:** `Token is not valid`

**Solutions:**
1. Token might be expired (7 days)
2. JWT_SECRET in .env might be wrong
3. Re-login to get new token

### CORS Errors

**Error:** `Access to XMLHttpRequest... has been blocked by CORS`

**Solution:** Update `FRONTEND_URL` in `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

Or if using different ports:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Deployment (Production)

### Deploy to Heroku (Free)

1. Install Heroku CLI:
```bash
npm install -g heroku
```

2. Login to Heroku:
```bash
heroku login
```

3. Create new app:
```bash
heroku create natart-api
```

4. Set environment variables:
```bash
heroku config:set JWT_SECRET="super_secret_production_key"
heroku config:set MONGODB_URI="your_atlas_connection_string"
heroku config:set FRONTEND_URL="https://your-frontend.com"
heroku config:set NODE_ENV="production"
```

5. Deploy:
```bash
git push heroku main
```

6. View logs:
```bash
heroku logs --tail
```

### Deploy to AWS (EC2)

1. Launch Ubuntu EC2 instance
2. SSH into instance:
```bash
ssh -i key.pem ubuntu@your-instance-ip
```

3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone repository:
```bash
git clone https://github.com/your-repo/natart-backend.git
cd natart-backend
```

5. Install dependencies:
```bash
npm install
```

6. Create `.env` file with production settings

7. Install PM2 (process manager):
```bash
npm install -g pm2
pm2 start server.js --name "natart-api"
pm2 save
pm2 startup
```

8. Setup reverse proxy with Nginx:
```bash
sudo apt-get install -y nginx
```

Create `/etc/nginx/sites-available/natart`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/natart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Deploy to DigitalOcean

Similar to AWS, but use DigitalOcean's App Platform for easier deployment.

---

## 📱 Mobile App Integration

If you're building mobile app (React Native/Flutter):

Update API URL:
```javascript
const API_BASE_URL = 'http://your-api-domain.com/api';
// or
const API_BASE_URL = 'https://your-api-domain.com/api';
```

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to something unique
- [ ] Use HTTPS in production
- [ ] Setup MongoDB firewall/security
- [ ] Never commit .env to git
- [ ] Use strong passwords for admin
- [ ] Enable CORS only for your frontend
- [ ] Setup rate limiting (future enhancement)
- [ ] Enable request validation
- [ ] Use environment-specific secrets

---

## 📊 Monitoring

Check server logs:
```bash
# Live logs
npm start

# With PM2
pm2 logs natart-api

# Heroku
heroku logs --tail
```

Check database:
```bash
mongosh
use natart
db.users.find()
db.orders.find()
db.products.find()
```

---

## 🆘 Support

If you encounter issues:

1. Check error messages carefully
2. Look at console/server logs
3. Verify all prerequisites are installed
4. Check if MongoDB is running
5. Try the troubleshooting section above

**Contact:** natart2026@outlook.com

---

## 📚 Next Steps

After backend is running:

1. ✅ Backend API is working
2. ⬜ Connect frontend to backend
3. ⬜ Test all API endpoints
4. ⬜ Build admin panel
5. ⬜ Implement real-time chat
6. ⬜ Add payment integration
7. ⬜ Deploy to production
8. ⬜ Setup monitoring & backups

---

## 📝 Useful Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with nodemon (auto-restart on changes)
npm run dev

# Check MongoDB status
mongosh --eval "db.version()"

# Create admin user
node create-admin.js

# Deploy to Heroku
git push heroku main

# View Heroku logs
heroku logs --tail

# SSH to EC2
ssh -i key.pem ubuntu@ip-address
```

---

**Good luck! 🚀**
