# NATART Backend - Quick Start Guide

## Installation & Setup

### 1. Install MongoDB

#### Local MongoDB:
```bash
# Windows/Mac/Linux
# Download from: https://www.mongodb.com/try/download/community

# Or use Homebrew (Mac):
brew install mongodb-community
brew services start mongodb-community
```

#### MongoDB Atlas (Cloud):
1. Visit https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Copy connection string
4. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/natart
```

### 2. Setup Backend

```bash
cd natart-backend
npm install
npm start
```

Server will run on: http://localhost:5000

---

## Testing with cURL

### Sign Up
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

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Products
```bash
curl -X GET http://localhost:5000/api/products
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "name=New Product" \
  -F "description=Product description" \
  -F "price=39" \
  -F "category=angels" \
  -F "stock=10" \
  -F "emoji=👼" \
  -F "image=@/path/to/image.png"
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+995577604756",
    "customerAddress": "Tbilisi, Georgia",
    "items": [
      {
        "productId": "PRODUCT_ID",
        "name": "Product Name",
        "price": 39,
        "quantity": 1,
        "image": "image.png"
      }
    ],
    "totalPrice": 49
  }'
```

---

## Frontend Integration Example

### HTML Login Form
```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>

<script src="api.js"></script>
<script>
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await login(email, password);
    if (result.token) {
      console.log('Login successful!');
      console.log('User:', result.user);
      // Redirect to dashboard
      window.location.href = '/dashboard.html';
    } else {
      alert(result.message);
    }
  });
</script>
```

### Shopping Cart Checkout
```javascript
async function checkout(cart, customerInfo) {
  const items = cart.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.qty,
    image: item.image
  }));

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = 10;
  const totalPrice = subtotal + deliveryFee;

  const result = await createOrder(
    customerInfo.name,
    customerInfo.email,
    customerInfo.phone,
    customerInfo.address,
    items,
    totalPrice
  );

  if (result.order) {
    console.log('Order created:', result.order.orderNumber);
    // Clear cart and show success message
    localStorage.removeItem('natartCart');
    alert('Order placed successfully!');
  }
}
```

### Chat Implementation
```javascript
// Create conversation
const conversation = await createConversation(
  'John Doe',
  'john@example.com',
  '+995577604756'
);

// Send message
await sendMessage(
  conversation.conversationId,
  'John Doe',
  'john@example.com',
  '+995577604756',
  'I have a question about my order'
);

// Get messages
const messages = await getMessages(conversation.conversationId);
```

### Admin Panel - Orders Management
```javascript
async function loadAdminOrders() {
  const orders = await getAllOrders();
  
  orders.forEach(order => {
    console.log(`Order #${order.orderNumber}`);
    console.log(`Status: ${order.status}`);
    console.log(`Total: ${order.totalPrice}₾`);
  });
}

async function updateOrder(orderId, newStatus) {
  const result = await updateOrderStatus(
    orderId,
    newStatus,
    'Order is being processed',
    'TRACK123456'
  );
  console.log('Order updated:', result.order);
}
```

### Real-time Chat with Socket.io
```html
<script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:5000');

  // Join chat
  socket.emit('user-join', userId, userName);

  // Listen for online users
  socket.on('users-online', (users) => {
    console.log('Users online:', users);
  });

  // Send message via Socket
  function sendSocketMessage(conversationId, message, senderName) {
    socket.emit('send-message', {
      conversationId,
      message,
      senderName,
      timestamp: new Date()
    });
  }

  // Receive message
  socket.on('receive-message', (data) => {
    console.log('New message:', data.message);
    // Update chat UI
  });

  // Admin reply
  socket.on('admin-message', (data) => {
    console.log('Admin replied:', data.message);
    // Show admin reply in chat
  });
</script>
```

---

## Database Seeding (Optional)

Create sample data for testing:

```javascript
// scripts/seed.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Create admin user
  const admin = new User({
    name: 'Admin User',
    email: 'admin@natart.com',
    phone: '+995577604756',
    password: 'admin123',
    role: 'admin',
    address: 'Tbilisi'
  });
  await admin.save();
  console.log('Admin created:', admin.email);

  // Create sample products
  const products = [
    {
      name: 'ანგელოზების სეტი',
      description: 'ხელნაკეთი თაბაშირის ანგელოზი',
      price: 39,
      category: 'angels',
      image: 'angel1.png',
      stock: 10,
      emoji: '👼'
    },
    // ... more products
  ];

  await Product.insertMany(products);
  console.log('Sample products created');

  mongoose.connection.close();
};

seedDatabase();
```

Run with:
```bash
node scripts/seed.js
```

---

## Deployment

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create natart-backend

# Set environment variables
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set MONGODB_URI="your_mongodb_uri"

# Deploy
git push heroku main
```

### AWS (EC2)
1. Launch EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Install dependencies: `npm install`
6. Start with PM2: `pm2 start server.js`

---

## Troubleshooting

### MongoDB Connection Error
```
Check:
1. MongoDB is running: mongod
2. Connection string in .env
3. MongoDB credentials are correct
4. Firewall/network access
```

### JWT Token Invalid
```
Solution:
1. Check JWT_SECRET is same in .env and code
2. Token might be expired (7 days)
3. Re-login to get new token
```

### CORS Error
```
Update FRONTEND_URL in .env:
FRONTEND_URL=http://localhost:3000
```

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 PID
```

---

## API Response Examples

### Successful Response
```json
{
  "message": "Success message",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
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

## Next Steps

1. ✅ Backend API დაადგენ
2. ⬜ Frontend-ის კიდე დაკავშირე (API integration)
3. ⬜ Admin Panel დაიზიზე React/Vue ში
4. ⬜ Socket.io real-time chat დაიმპლემენტე
5. ⬜ Payment gateway დაამატე (Stripe/PayPal)
6. ⬜ Email notifications დაამატე
7. ⬜ Production-ზე დაიმპლოი

---

## Contact

For issues: natart2026@outlook.com
