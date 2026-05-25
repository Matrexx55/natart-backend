# NATART Backend - Complete Summary

## 🎉 What You're Getting

დაწერილი სრული **Node.js + Express + MongoDB + Socket.io** backend API NATART ვებ-საიტისთვის.

---

## ✨ Features

### 🔐 **Authentication & User Management**
- ✅ User Registration (Sign Up)
- ✅ User Login with JWT
- ✅ Password Hashing (bcryptjs)
- ✅ Update User Profile
- ✅ Change Password
- ✅ Logout
- ✅ Role-based Access (User/Admin)

### 🛍️ **Product Management**
- ✅ Get All Products
- ✅ Get Single Product
- ✅ Create Product (Admin)
- ✅ Update Product (Admin)
- ✅ Delete Product (Admin)
- ✅ Product Image Upload
- ✅ Product Categories
- ✅ Stock Management
- ✅ Product Reviews & Ratings

### 📦 **Order Management**
- ✅ Create Orders
- ✅ Get User Orders
- ✅ Get All Orders (Admin)
- ✅ Order Status Updates (pending → confirmed → shipped → delivered)
- ✅ Payment Status Tracking
- ✅ Order Notes (Admin)
- ✅ Tracking Numbers
- ✅ Order Statistics & Analytics
- ✅ Auto-generated Order Numbers

### 💬 **Real-Time Chat System**
- ✅ Create Conversations
- ✅ Send/Receive Messages
- ✅ Admin Replies
- ✅ Conversation History
- ✅ Real-time Notifications (Socket.io)
- ✅ Message Storage in Database
- ✅ Support for Guest Users (non-registered)
- ✅ Conversation Status (active/closed/archived)

### 👨‍💼 **Admin Panel API**
- ✅ Dashboard Statistics
- ✅ User Management
- ✅ Order Analytics
- ✅ Monthly Revenue Reports
- ✅ Order Status Breakdown
- ✅ Conversation Management
- ✅ User Deactivation/Activation

### 🔧 **Additional Features**
- ✅ File Upload (Multer)
- ✅ CORS Enabled
- ✅ Error Handling
- ✅ Input Validation
- ✅ Real-time Events (Socket.io)
- ✅ Environment Configuration (.env)

---

## 📁 Project Structure

```
natart-backend/
├── models/                      # Database Models
│   ├── User.js                 # User schema
│   ├── Product.js              # Product schema
│   ├── Order.js                # Order schema
│   ├── ChatMessage.js          # Chat message schema
│   └── Conversation.js         # Conversation schema
│
├── routes/                      # API Routes
│   ├── auth.js                 # Authentication routes
│   ├── products.js             # Product routes
│   ├── orders.js               # Order routes
│   ├── chat.js                 # Chat routes
│   └── admin.js                # Admin routes
│
├── middleware/                  # Custom Middleware
│   └── auth.js                 # JWT authentication
│
├── uploads/                     # File uploads directory
│   └── products/               # Product images
│
├── server.js                   # Main server file
├── package.json                # Dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── README.md                   # Full API documentation
├── QUICK_START.md              # Quick start guide
├── FRONTEND_INTEGRATION.js     # Frontend helper functions
└── node_modules/               # Installed packages
```

---

## 🚀 Installation Summary

### 1. Prerequisites
```bash
# Install Node.js from: https://nodejs.org/
# Install MongoDB from: https://www.mongodb.com/
node --version    # v14 or higher
npm --version
mongod --version  # or MongoDB Atlas
```

### 2. Setup Project
```bash
cd natart-backend
npm install
```

### 3. Configure .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/natart
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Start Server
```bash
npm start
# Server running on http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST   /signup           - Register new user
POST   /login            - Login user
GET    /me               - Get current user (requires token)
PUT    /profile          - Update profile (requires token)
POST   /change-password  - Change password (requires token)
```

### Products (`/api/products`)
```
GET    /                 - Get all products
GET    /:id              - Get single product
POST   /                 - Create product (Admin only)
PUT    /:id              - Update product (Admin only)
DELETE /:id              - Delete product (Admin only)
```

### Orders (`/api/orders`)
```
POST   /                 - Create order
GET    /user             - Get user orders (requires token)
GET    /detail/:id       - Get order detail
GET    /                 - Get all orders (Admin only)
PUT    /:id/status       - Update order status (Admin only)
PUT    /:id/payment      - Update payment status (Admin only)
```

### Chat (`/api/chat`)
```
POST   /conversation     - Create/get conversation
POST   /message          - Send message
GET    /messages/:convId - Get conversation messages
GET    /conversations    - Get all conversations (Admin)
POST   /reply            - Send admin reply
PUT    /:convId/read     - Mark as read
PUT    /:convId/close    - Close conversation
```

### Admin (`/api/admin`)
```
GET    /dashboard        - Dashboard stats
GET    /users            - Get all users
GET    /users/:id        - Get user detail
PUT    /users/:id/deactivate - Deactivate user
PUT    /users/:id/activate   - Activate user
GET    /conversations    - Get conversations
GET    /orders/analysis/monthly - Monthly stats
GET    /orders/analysis/status  - Order status breakdown
```

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **Role-based Access** - User vs Admin permissions
- ✅ **CORS Protection** - Restrict cross-origin requests
- ✅ **Input Validation** - Validate all inputs
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **HTTP Status Codes** - Proper status code usage

---

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  address: String,
  role: 'user' | 'admin',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  emoji: String,
  rating: Number,
  reviews: [Object],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  orderNumber: String (unique),
  userId: ObjectId,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  items: [Object],
  subtotal: Number,
  deliveryFee: Number,
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'completed',
  adminNotes: String,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ChatMessage
```javascript
{
  conversationId: String,
  userId: ObjectId,
  senderName: String,
  message: String,
  isFromAdmin: Boolean,
  isRead: Boolean,
  createdAt: Date
}
```

### Conversation
```javascript
{
  conversationId: String (unique),
  userId: ObjectId,
  userName: String,
  userEmail: String,
  status: 'active' | 'closed' | 'archived',
  lastMessage: String,
  hasUnreadMessages: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 Socket.IO Events

### Client to Server
```javascript
socket.emit('user-join', userId, userName)
socket.emit('send-message', {conversationId, message})
socket.emit('admin-reply', {conversationId, message})
```

### Server to Client
```javascript
socket.on('users-online', (users) => {})
socket.on('receive-message', (data) => {})
socket.on('admin-message', (data) => {})
```

---

## 💾 Database

### Supported Databases
- ✅ MongoDB (Local)
- ✅ MongoDB Atlas (Cloud)

### Connection Examples
```env
# Local
MONGODB_URI=mongodb://localhost:27017/natart

# Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natart
```

---

## 🧪 Testing

### cURL Examples

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+995577604756",
    "password": "password123",
    "confirmPassword": "password123",
    "address": "Tbilisi"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Products
```bash
curl http://localhost:5000/api/products
```

#### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+995577604756",
    "customerAddress": "Tbilisi",
    "items": [{"name": "Product", "price": 39, "quantity": 1}],
    "totalPrice": 49
  }'
```

### Postman
1. Download Postman: https://www.postman.com/downloads/
2. Import requests from API documentation
3. Set headers: `Content-Type: application/json`
4. Add token: `Authorization: Bearer <token>`

---

## 🌐 Frontend Integration

Use the provided `FRONTEND_INTEGRATION.js` file which includes all API helper functions:

```javascript
import { login, signup, getProducts, createOrder, sendMessage } from './api.js';

// Usage
const result = await login(email, password);
const products = await getProducts();
await createOrder(...);
```

---

## 🚀 Deployment

### Heroku (Easiest)
```bash
heroku create natart-api
heroku config:set JWT_SECRET="secret"
git push heroku main
```

### AWS EC2
1. Launch Ubuntu instance
2. Install Node.js & MongoDB
3. Clone repository
4. Install dependencies
5. Configure environment
6. Start with PM2
7. Setup Nginx reverse proxy

### DigitalOcean
Similar to AWS but with DigitalOcean's App Platform

---

## 📖 Documentation Files

1. **README.md** - Full API documentation
2. **QUICK_START.md** - Quick start guide with examples
3. **INSTALLATION_GUIDE.md** - Detailed installation steps
4. **FRONTEND_INTEGRATION.js** - Helper functions for frontend
5. **This file** - Complete summary

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcryptjs
- **Real-time:** Socket.io
- **File Upload:** Multer
- **CORS:** cors
- **Environment:** dotenv

---

## 📝 Sample API Response

### Successful Login
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+995577604756",
    "address": "Tbilisi",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Error Response
```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

---

## 🔑 Environment Variables Explained

```env
PORT=5000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/natart # Database URI
JWT_SECRET=secret_key_change_this           # JWT signing key
FRONTEND_URL=http://localhost:3000          # Frontend domain for CORS
NODE_ENV=development                        # Environment mode
```

---

## 📞 Support & Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Make sure MongoDB is running
- Check connection string
- Verify credentials

**2. Port Already in Use**
- Change PORT in .env
- Kill process on port 5000

**3. JWT Token Invalid**
- Token might be expired
- Check JWT_SECRET
- Re-login

**4. CORS Error**
- Update FRONTEND_URL
- Check allowed origins

---

## 🎯 Next Steps

1. ✅ **Backend is complete** - Ready to use
2. ⬜ **Connect Frontend** - Update API URLs
3. ⬜ **Build Admin Panel** - Use admin routes
4. ⬜ **Test APIs** - Use cURL or Postman
5. ⬜ **Deploy** - Heroku, AWS, or DigitalOcean
6. ⬜ **Monitor** - Setup logging and alerts

---

## 📚 Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.io Guide](https://socket.io/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Mongoose Docs](https://mongoosejs.com/)

---

## 📄 License

NATART © 2024

---

## 📧 Contact

**Email:** natart2026@outlook.com
**Phone:** +995 577 604 756
**Location:** Tbilisi, Georgia

---

## ✅ Checklist

- [x] User Authentication
- [x] Product Management
- [x] Order Management
- [x] Chat System
- [x] Admin Panel
- [x] Database Models
- [x] API Documentation
- [x] Frontend Integration
- [x] Error Handling
- [x] Security
- [ ] Payment Integration (Future)
- [ ] Email Notifications (Future)
- [ ] SMS Notifications (Future)
- [ ] Advanced Analytics (Future)

---

**Backend is ready to deploy! 🚀**
