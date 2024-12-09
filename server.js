// server/app.js
const express = require('express');
const connectDB = require('./server/config/db');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const productRoutes = require('./server/routers/productRoutes');
const authRoutes = require('./server/routers/authRoutes');
const sellerRoutes = require('./server/routers/sellerRoutes');
const authMiddleware = require('./server/middleware/auth');

dotenv.config();

// server/app.js or server.js
require('dotenv').config({ path: './server/.env' });

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: '*', // Replace with your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, HTTP authentication) cross-origin
  optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
  allowedHeaders: ['Content-Type'], // Allow specific headers
};

// Middleware

app.use(express.json());

//use cors
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Successfull',
    message: 'Hello from Auction platform',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/seller', sellerRoutes);

const PORT = process.env.SERVER_PORT || 5000;
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  // Listen for incoming messages and broadcast them to other clients
  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
