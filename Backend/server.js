const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connexionDB = require('./config/connexionDB');


dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
const app = express();

// Connect to database
connexionDB();


// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
//authentification
//to upload images and create new product 
app.use('/api/upload', require('./routes/uploadRoutes'));

app.use('/api/auth', require('./routes/authRoutes'));
//products
app.use('/api/products', require('./routes/productRoutes'));
//categories
app.use('/api/categories', require('./routes/categoryRoutes'));
//users
app.use('/api/users', require('./routes/userRoutes'));
//orders 
app.use('/api/orders', require('./routes/orderRoutes'));
//free shipping price config
app.use("/api/config", require("./routes/configRoutes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
