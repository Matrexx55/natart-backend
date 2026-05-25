// API Helper Functions for NATART Frontend
// Save this as: api.js in your frontend project

const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('natartToken');
}

// Set token to localStorage
function setToken(token) {
  localStorage.setItem('natartToken', token);
}

// Remove token from localStorage
function removeToken() {
  localStorage.removeItem('natartToken');
}

// ==================== AUTH API ====================

// Sign up
async function signup(name, email, phone, password, confirmPassword, address = '') {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, phone, password, confirmPassword, address
    })
  });
  const data = await res.json();
  if (data.token) setToken(data.token);
  return data;
}

// Login
async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) setToken(data.token);
  return data;
}

// Logout
function logout() {
  removeToken();
}

// Get current user
async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Update profile
async function updateProfile(name, phone, address) {
  const res = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ name, phone, address })
  });
  return await res.json();
}

// Change password
async function changePassword(oldPassword, newPassword, confirmPassword) {
  const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
  });
  return await res.json();
}

// ==================== PRODUCTS API ====================

// Get all products
async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  return await res.json();
}

// Get single product
async function getProduct(productId) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`);
  return await res.json();
}

// Create product (Admin)
async function createProduct(formData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData // FormData for file upload
  });
  return await res.json();
}

// Update product (Admin)
async function updateProduct(productId, formData) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  return await res.json();
}

// Delete product (Admin)
async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// ==================== ORDERS API ====================

// Create order
async function createOrder(customerName, customerEmail, customerPhone, customerAddress, items, totalPrice) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName, customerEmail, customerPhone, customerAddress, items, totalPrice,
      userId: localStorage.getItem('natartUserId') || null
    })
  });
  return await res.json();
}

// Get user orders
async function getUserOrders() {
  const res = await fetch(`${API_BASE_URL}/orders/user`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Get order detail
async function getOrderDetail(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/detail/${orderId}`);
  return await res.json();
}

// Get all orders (Admin)
async function getAllOrders() {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Update order status (Admin)
async function updateOrderStatus(orderId, status, adminNotes = '', trackingNumber = '') {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ status, adminNotes, trackingNumber })
  });
  return await res.json();
}

// ==================== CHAT API ====================

// Create conversation
async function createConversation(userName, userEmail, userPhone, userId = null) {
  const res = await fetch(`${API_BASE_URL}/chat/conversation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, userEmail, userPhone, userId })
  });
  return await res.json();
}

// Send message
async function sendMessage(conversationId, senderName, senderEmail, senderPhone, message, userId = null) {
  const res = await fetch(`${API_BASE_URL}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId, senderName, senderEmail, senderPhone, message, userId
    })
  });
  return await res.json();
}

// Get messages
async function getMessages(conversationId) {
  const res = await fetch(`${API_BASE_URL}/chat/messages/${conversationId}`);
  return await res.json();
}

// Get conversations (Admin)
async function getConversations() {
  const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Admin reply
async function adminReply(conversationId, message, adminName = 'NATART Support') {
  const res = await fetch(`${API_BASE_URL}/chat/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ conversationId, message, adminName })
  });
  return await res.json();
}

// ==================== ADMIN API ====================

// Get dashboard
async function getDashboard() {
  const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Get all users (Admin)
async function getAllUsers() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Deactivate user (Admin)
async function deactivateUser(userId) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/deactivate`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Get order analysis (Admin)
async function getOrderAnalysis() {
  const res = await fetch(`${API_BASE_URL}/admin/orders/analysis/monthly`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return await res.json();
}

// Export all functions
export {
  getToken, setToken, removeToken,
  signup, login, logout, getCurrentUser, updateProfile, changePassword,
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  createOrder, getUserOrders, getOrderDetail, getAllOrders, updateOrderStatus,
  createConversation, sendMessage, getMessages, getConversations, adminReply,
  getDashboard, getAllUsers, deactivateUser, getOrderAnalysis
};
