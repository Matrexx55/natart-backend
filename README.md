# NATART Backend API

სრული backend სისტემა NATART ვებ-საიტისთვის, რომელიც მოიცავს:
- ✅ User Authentication (რეგისტრაცია/ავტორიზაცია)
- ✅ Product Management (პროდუქტების დაამატება, რედაქტირება, წაშლა)
- ✅ Order Management (შეკვეთების კვლევა, განახლება)
- ✅ Chat System (Real-time messaging with Socket.io)
- ✅ Admin Panel (სრული ადმინ ფუნქციონალობა)

## Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud - MongoDB Atlas)
- npm

## Installation

1. **Clone repository და შედი დირექტორიაში:**
```bash
cd natart-backend
npm install
```

2. **Configure .env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/natart
JWT_SECRET=your_super_secret_key_here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

3. **ალტერნატივა: MongoDB Atlas-ის გამოყენება:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natart
```

4. **Start the server:**
```bash
npm start        # Production
npm run dev      # Development (with nodemon)
```

Server კვება http://localhost:5000

---

## API Routes & Endpoints

### Authentication Routes (`/api/auth`)

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+995577604756",
  "password": "password123",
  "confirmPassword": "password123",
  "address": "Tbilisi, Georgia"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Logged in successfully",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+995577604756",
  ...
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+995577604756",
  "address": "New Address"
}

Response: 200 OK
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}

Response: 200 OK
```

---

### Products Routes (`/api/products`)

#### Get All Products
```
GET /api/products

Response: 200 OK
[
  {
    "_id": "...",
    "name": "ანგელოზების სეტი",
    "description": "...",
    "price": 39,
    "stock": 10,
    "image": "filename.png",
    ...
  }
]
```

#### Get Single Product
```
GET /api/products/:productId

Response: 200 OK
{ ... }
```

#### Create Product (Admin Only)
```
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- name: "Product Name"
- description: "Product Description"
- price: 39
- category: "angels" / "christmas" / "autumn" / "other"
- stock: 10
- emoji: "👼"
- image: <file>

Response: 201 Created
```

#### Update Product (Admin Only)
```
PUT /api/products/:productId
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data: Same as Create Product

Response: 200 OK
```

#### Delete Product (Admin Only)
```
DELETE /api/products/:productId
Authorization: Bearer <admin_token>

Response: 200 OK
```

---

### Orders Routes (`/api/orders`)

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+995577604756",
  "customerAddress": "Tbilisi, Georgia",
  "items": [
    {
      "productId": "...",
      "name": "Product Name",
      "price": 39,
      "quantity": 2,
      "image": "image.png"
    }
  ],
  "totalPrice": 88,
  "deliveryFee": 10,
  "userId": "..." // Optional if authenticated
}

Response: 201 Created
{
  "message": "Order created successfully",
  "order": { ... }
}
```

#### Get User Orders
```
GET /api/orders/user
Authorization: Bearer <token>

Response: 200 OK
[ { ... }, { ... } ]
```

#### Get Order Detail
```
GET /api/orders/detail/:orderId

Response: 200 OK
{ ... }
```

#### Get All Orders (Admin Only)
```
GET /api/orders
Authorization: Bearer <admin_token>

Response: 200 OK
[ { ... }, { ... } ]
```

#### Update Order Status (Admin Only)
```
PUT /api/orders/:orderId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "confirmed" | "shipped" | "delivered" | "cancelled",
  "adminNotes": "Order notes",
  "trackingNumber": "TRACK123"
}

Response: 200 OK
```

#### Update Payment Status (Admin Only)
```
PUT /api/orders/:orderId/payment
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "paymentStatus": "pending" | "completed"
}

Response: 200 OK
```

---

### Chat Routes (`/api/chat`)

#### Create/Get Conversation
```
POST /api/chat/conversation
Content-Type: application/json

{
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "+995577604756",
  "userId": "..." // Optional
}

Response: 200 OK
{
  "conversationId": "...",
  "userName": "John Doe",
  "status": "active",
  ...
}
```

#### Send Message
```
POST /api/chat/message
Content-Type: application/json

{
  "conversationId": "...",
  "senderName": "John Doe",
  "senderEmail": "john@example.com",
  "senderPhone": "+995577604756",
  "message": "Hello, I have a question",
  "userId": "..." // Optional
}

Response: 201 Created
```

#### Get Conversation Messages
```
GET /api/chat/messages/:conversationId

Response: 200 OK
[ { ... }, { ... } ]
```

#### Get All Conversations (Admin Only)
```
GET /api/chat/conversations
Authorization: Bearer <admin_token>

Response: 200 OK
[ { ... }, { ... } ]
```

#### Admin Send Reply
```
POST /api/chat/reply
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "conversationId": "...",
  "message": "Thank you for your inquiry. ...",
  "adminName": "NATART Support"
}

Response: 201 Created
```

#### Mark Conversation as Read
```
PUT /api/chat/conversation/:conversationId/read

Response: 200 OK
```

#### Close Conversation
```
PUT /api/chat/conversation/:conversationId/close

Response: 200 OK
```

---

### Admin Routes (`/api/admin`)

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "totalUsers": 45,
  "totalProducts": 28,
  "totalOrders": 120,
  "pendingOrders": 5,
  "totalConversations": 32,
  "unreadConversations": 3,
  "totalRevenue": 4500
}
```

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>

Response: 200 OK
[ { ... }, { ... } ]
```

#### Get User Detail
```
GET /api/admin/users/:userId
Authorization: Bearer <admin_token>

Response: 200 OK
{ ... }
```

#### Deactivate User
```
PUT /api/admin/users/:userId/deactivate
Authorization: Bearer <admin_token>

Response: 200 OK
```

#### Activate User
```
PUT /api/admin/users/:userId/activate
Authorization: Bearer <admin_token>

Response: 200 OK
```

#### Get All Conversations
```
GET /api/admin/conversations
Authorization: Bearer <admin_token>

Response: 200 OK
[ { ... }, { ... } ]
```

#### Get Order Analysis (Monthly)
```
GET /api/admin/orders/analysis/monthly
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "_id": "2024-01",
    "totalOrders": 10,
    "totalRevenue": 1000
  }
]
```

#### Get Order Status Breakdown
```
GET /api/admin/orders/analysis/status
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "_id": "pending",
    "count": 5,
    "totalRevenue": 500
  }
]
```

---

## Socket.IO Real-Time Events

ჩატი იყენებს Socket.IO real-time კომუნიკაციისთვის.

### Client Events:

```javascript
// User joins
socket.emit('user-join', userId, userName);

// Send message
socket.emit('send-message', {
  conversationId: '...',
  message: 'Hello',
  senderName: 'John'
});

// Admin reply
socket.emit('admin-reply', {
  conversationId: '...',
  message: 'Thanks for your message'
});
```

### Server Events (Listen):

```javascript
// Users online
socket.on('users-online', (users) => {
  console.log('Online users:', users);
});

// Receive message
socket.on('receive-message', (data) => {
  console.log('New message:', data);
});

// Admin message
socket.on('admin-message', (data) => {
  console.log('Admin replied:', data);
});
```

---

## Database Models

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
  profileImage: String,
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
  images: [String],
  stock: Number,
  isActive: Boolean,
  emoji: String,
  rating: Number,
  reviews: Array,
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
  items: Array,
  subtotal: Number,
  deliveryFee: Number,
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'completed',
  notes: String,
  adminNotes: String,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ChatMessage
```javascript
{
  userId: ObjectId,
  senderName: String,
  senderEmail: String,
  message: String,
  isFromAdmin: Boolean,
  isFromUser: Boolean,
  conversationId: String,
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
  userPhone: String,
  subject: String,
  status: 'active' | 'closed' | 'archived',
  lastMessage: String,
  hasUnreadMessages: Boolean,
  isFromRegisteredUser: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Admin only)
- `404` - Not Found
- `500` - Server Error

---

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Admin-only routes protected
- CORS enabled
- Input validation on all endpoints

---

## Project Structure

```
natart-backend/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── ChatMessage.js
│   └── Conversation.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── chat.js
│   └── admin.js
├── middleware/
│   └── auth.js
├── uploads/
│   └── products/
├── .env
├── .gitignore
├── server.js
└── package.json
```

---

## Development

Nodemon პერანტელი გამოიყენეთ dev რეჟიმში:

```bash
npm run dev
```

---

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use strong JWT_SECRET
3. Configure MongoDB URI for production
4. Enable CORS for your frontend domain
5. Deploy on Heroku, AWS, DigitalOcean, etc.

---

## License

NATART © 2024

---

## Support

For issues and questions, contact: natart2026@outlook.com
