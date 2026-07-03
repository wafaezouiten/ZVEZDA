const Order = require("../models/Order");
const Config =require("../models/Config")

// Create Order
const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id, // <-- assign user from req.user
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "username email")
    .populate("orderItems.product", "name price") // populate product name and price
    .sort({ createdAt: -1 });
  res.json(orders);
};

// Get order by ID
const getOrderById = async (req, res) => {
try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const config = await Config.findOne();

    // Attach config data to order response
    const orderWithConfig = {
      ...order.toObject(),
      freeShippingThreshold: config ? config.freeShippingThreshold : 800,
    };

    res.json(orderWithConfig);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark order as paid
const markAsPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.isReturned = false;
    order.paidAt = Date.now();
    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// Mark order as delivered (admin only)
const markAsDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.isReturned = false;
    order.deliveredAt = Date.now();
    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

//mark as returned 
const markAsReturned = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isReturned = true;
    order.isDelivered = false;
    order.isPaid = false;
    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};


// EXPORTS
module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markAsPaid,
  markAsDelivered,
  markAsReturned
};
