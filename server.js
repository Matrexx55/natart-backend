const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/natart')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io Chat
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('user-join', (userId, userName) => {
    connectedUsers.set(socket.id, { userId, userName, socketId: socket.id });
    io.emit('users-online', Array.from(connectedUsers.values()));
  });

  // Send message
  socket.on('send-message', (data) => {
    io.emit('receive-message', {
      ...data,
      timestamp: new Date(),
      socketId: socket.id
    });
  });

  // Admin reply
  socket.on('admin-reply', (data) => {
    io.emit('admin-message', {
      ...data,
      timestamp: new Date()
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    io.emit('users-online', Array.from(connectedUsers.values()));
    console.log('User disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'NATART Backend API is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
