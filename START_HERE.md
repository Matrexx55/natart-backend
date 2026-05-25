# 🎉 NATART Backend - Complete Solution

## დაწერილი სრული Backend API Node.js-ით!

ეს არის **სრულიად კომპლექსური backend system** NATART ვებ-საიტისთვის, რომელიც მოიცავს:

✅ **User Authentication** - რეგისტრაცია, ლოგინი, პროფილი  
✅ **Product Management** - პროდუქტების მენეჯმენტი  
✅ **Order Management** - შეკვეთის სისტემა  
✅ **Real-time Chat** - Socket.io-ს მাშინ ჩატი  
✅ **Admin Panel** - ადმინ ფუნქციონალობა  
✅ **Complete Documentation** - სრული დოკუმენტაცია  

---

## 📚 Documentation Files

### 🚀 START HERE:
1. **PROJECT_STRUCTURE.txt** - პროექტის სტრუქტურა
2. **BACKEND_SUMMARY.md** - სრული ფუნქციონალობის შეჯამება
3. **INSTALLATION_GUIDE.md** - ნაბიჯ-ნაბიჯ ინსტალაცია

### 📖 natart-backend/ Folder:
4. **README.md** - სრული API დოკუმენტაცია
5. **QUICK_START.md** - სწრაფი დაწყების გაიდი
6. **FRONTEND_INTEGRATION.js** - ფრონტენდ ფუნქციები
7. **.env** - კონფიგურაცია (შეცვალეთ საკუთარ ღირებულებებზე!)

---

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd natart-backend
npm install
```

### 2. Configure .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/natart
JWT_SECRET=change_this_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Make sure MongoDB is Running
```bash
# If not running, start it:
mongod
```

### 4. Start Server
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected
```

✅ Done! Your API is now running at: **http://localhost:5000**

---

## 🧪 Test the API

### Using cURL:
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"+995577604756","password":"test123","confirmPassword":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get products
curl http://localhost:5000/api/products
```

### Using Postman:
1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request
3. Test endpoints

---

## 📁 What's Included

```
natart-backend/
├── models/          → Database models (User, Product, Order, Chat)
├── routes/          → API endpoints (auth, products, orders, chat, admin)
├── middleware/      → JWT authentication
├── server.js        → Main server file
├── .env            → Configuration (EDIT THIS!)
├── package.json    → Dependencies
├── README.md       → Full API docs
├── QUICK_START.md  → Quick guide
└── FRONTEND_INTEGRATION.js → Helper functions
```

---

## 🔌 API Features

### Authentication ✅
- User Registration
- Login with JWT
- Profile Management
- Password Change

### Products ✅
- View all products
- Create/Edit/Delete products (Admin)
- Image uploads
- Categories
- Stock management

### Orders ✅
- Create orders
- Order tracking
- Status updates (pending → shipped → delivered)
- Admin management
- Order statistics

### Chat ✅
- Real-time messaging
- Support for guests and registered users
- Admin replies
- Message history
- Conversation management

### Admin ✅
- Dashboard statistics
- User management
- Order analytics
- Revenue reports
- Conversation management

---

## 📊 Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| Authentication | JWT |
| Real-time | Socket.io |
| File Upload | Multer |
| Password | bcryptjs |

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/products` | Get all products |
| POST | `/api/orders` | Create order |
| GET | `/api/chat/messages/:id` | Get chat messages |
| GET | `/api/admin/dashboard` | Admin stats |

See **README.md** for complete endpoint list.

---

## 🔐 Security Features

- JWT Token Authentication
- Password Hashing (bcryptjs)
- Role-based Access Control
- CORS Protection
- Input Validation
- Error Handling

---

## 🚀 Deployment Options

### Heroku (Easiest - Free)
```bash
heroku create natart-api
git push heroku main
```

### AWS EC2
1. Launch instance
2. Install Node.js & MongoDB
3. Deploy code
4. Setup Nginx

### DigitalOcean
Similar to AWS, use App Platform for one-click deployment

See **INSTALLATION_GUIDE.md** for detailed deployment instructions.

---

## 🛠️ Troubleshooting

### MongoDB Connection Error?
- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB credentials

### Port Already in Use?
- Change PORT in `.env`
- Or: `lsof -i :5000` then `kill -9 PID`

### CORS Error?
- Update FRONTEND_URL in `.env`

### Token Invalid?
- Token expires after 7 days
- Check JWT_SECRET
- Re-login to get new token

---

## 📱 Frontend Integration

The **FRONTEND_INTEGRATION.js** file contains ready-to-use functions:

```javascript
// Import functions
import { 
  signup, login, getProducts, 
  createOrder, sendMessage 
} from './api.js';

// Use in your code
const result = await login(email, password);
const products = await getProducts();
await createOrder(orderData);
```

---

## 👨‍💻 Creating Admin User

Two options:

### Option 1: Using Database directly
Use MongoDB Compass and insert admin user with `role: "admin"`

### Option 2: Using Script
```bash
node create-admin.js
```

---

## 📝 Environment Variables

```env
PORT=5000                                  # Server port
MONGODB_URI=mongodb://localhost:27017/...  # Database URL
JWT_SECRET=your_secret_key                 # Token secret (CHANGE!)
FRONTEND_URL=http://localhost:3000         # Frontend domain
NODE_ENV=development                       # Environment
```

⚠️ Keep `.env` secret! Never commit to git.

---

## 📊 Database Models

### User
```javascript
{ name, email, phone, password, address, role, isActive }
```

### Product
```javascript
{ name, description, price, category, image, stock, emoji }
```

### Order
```javascript
{ customerName, items, totalPrice, status, paymentStatus, adminNotes }
```

### ChatMessage
```javascript
{ conversationId, senderName, message, isFromAdmin, createdAt }
```

### Conversation
```javascript
{ conversationId, userName, userEmail, status, lastMessage }
```

---

## 🔄 Socket.IO Real-Time Chat

```javascript
// Client-side
socket.emit('send-message', {conversationId, message, senderName});
socket.on('receive-message', (data) => { /* Update UI */ });

// Admin reply
socket.emit('admin-reply', {conversationId, message});
```

---

## 📚 Documentation Guide

**Start with these files in order:**

1. **PROJECT_STRUCTURE.txt** - Overview of all files
2. **INSTALLATION_GUIDE.md** - Installation steps
3. **natart-backend/README.md** - API documentation
4. **natart-backend/QUICK_START.md** - Usage examples
5. **BACKEND_SUMMARY.md** - Complete feature summary

---

## ✅ Checklist

- [ ] Install Node.js
- [ ] Install MongoDB
- [ ] Extract natart-backend folder
- [ ] Run `npm install`
- [ ] Edit `.env` file
- [ ] Start MongoDB (`mongod`)
- [ ] Run `npm start`
- [ ] Test API with cURL
- [ ] Connect frontend
- [ ] Create admin user
- [ ] Deploy to production

---

## 🎯 Next Steps

1. ✅ Backend Setup (Complete!)
2. ⬜ Test all endpoints (use Postman)
3. ⬜ Connect your frontend to API
4. ⬜ Build admin panel
5. ⬜ Setup real-time chat
6. ⬜ Deploy to production
7. ⬜ Add payment gateway
8. ⬜ Setup email notifications

---

## 📞 Support

**Email:** natart2026@outlook.com  
**Phone:** +995 577 604 756  
**Location:** Tbilisi, Georgia

---

## 💡 Tips

- Keep JWT_SECRET safe and unique
- Use HTTPS in production
- Enable MongoDB authentication
- Setup rate limiting
- Monitor server logs
- Regular database backups
- Use environment-specific configs

---

## 📦 What You Get

✅ Complete backend source code  
✅ All models and routes  
✅ Authentication system  
✅ Database schemas  
✅ API documentation  
✅ Frontend integration helpers  
✅ Example requests  
✅ Deployment guides  
✅ Security best practices  
✅ Error handling  

---

## 🚀 Ready to Deploy?

1. Choose hosting: Heroku, AWS, DigitalOcean
2. Setup MongoDB Atlas
3. Configure environment variables
4. Deploy code
5. Test in production
6. Monitor logs

See **INSTALLATION_GUIDE.md** for detailed steps.

---

## 📄 License

NATART © 2024 All Rights Reserved

---

## 🎉 Summary

You now have a **production-ready backend** with:
- User authentication
- Product management
- Order processing
- Real-time chat
- Admin dashboard
- Complete API documentation

**Everything is ready to use! Start with the installation guide.**

---

**Happy coding! 🚀**

For detailed instructions, see the documentation files above.
