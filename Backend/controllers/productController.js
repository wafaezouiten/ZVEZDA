const Product = require("../models/Product");
const mongoose = require("mongoose");

// GET /api/products

const getProducts = async (req, res) => {
  try {
    const category = req.query.category || "";

    const query = category ? { category } : {};

    if (req.query.newArrivals === "true") {
      // Par exemple, on récupère les 6 derniers produits créés (triés par date)
      const products = await Product.find({}).sort({ createdAt: -1 }).limit(6);
      return res.json(products);
    }

    // Sinon, tous les produits (ou selon d'autres filtres)
    const products = await Product.find(query).populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    let {
      name,
      category,
      price,
      variants,
      sizes,
      colors,
    } = req.body;
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    function safeJsonParse(field) {
      if (typeof field === "string") {
        try {
          return JSON.parse(field);
        } catch {
          throw new Error(`Invalid JSON format for field`);
        }
      }
      return field;
    }

    try {
      variants = safeJsonParse(req.body.variants);
      sizes = safeJsonParse(req.body.sizes);
      colors = safeJsonParse(req.body.colors);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    // Map uploaded files to image URLs or paths
    const images = req.files
      ? req.files.map((file) => `/${file.path.replace(/\\/g, "/")}`)
      : [];

    if (images.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images are allowed" });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      variants,
      images,
      sizes,
      colors,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      images,
      price,
      promo,
      stock,
      variants,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.category = category || product.category;
    product.images = images || product.images;
    product.price = price || product.price;
    product.promo = promo || product.promo;
    product.stock = stock ?? product.stock;
    product.variants = variants || product.variants;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/products/:id/reviews
const addReviewToProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.userId; // From auth middleware

    if (!rating || isNaN(rating)) {
      return res.status(400).json({ message: "Rating must be a valid number" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = {
      user: userId,
      comment,
      rating: Number(rating),
    };

    product.reviews.push(newReview);

    // Recalculate average rating (optional)
    product.rating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(201).json({ message: "Review added", reviews: product.reviews });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/products/:id/reviews
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId).select("reviews");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// DELETE /api/products/:productId/reviews/:reviewId
const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const user = req.user; // From auth middleware

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the review to delete
    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is review owner or admin
    if (review.user.toString() !== user._id.toString() && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    // Remove the review
    review.remove();

    // Update number of reviews
    product.numReviews = product.reviews.length;

    // Recalculate average rating
    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// À la fin du fichier :
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReviewToProduct,
  getProductReviews,
  deleteReview,
};
