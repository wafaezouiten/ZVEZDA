const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status:String,
  images: [{ type: String }],
  reviews: [reviewSchema],
  numReviews: { type: Number, required: true, default: 0 },
  rating: {
    type: Number,
    default: 0,
  },
  price: { type: Number, required: true },
  promo: {
    type: Number, // e.g. 20 = 20% off
    default: 0,
  },
  finalPrice: { type: Number }, // Calculated price after promo
  stock: { type: Number, required: true, default: 0 },//same of variant inventory  default is 0
  colors:[String],
  sizes:[String],
  variants: [
    {
      color: String,
      size: String,
      inventory: { type: Number, default: 0 },
    },
  ],
  category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true,
},
 
 dealEndDate: Date,
  createdAt: { type: Date, default: Date.now },
});

productSchema.pre("save", function (next) {
  //set the stock by the sum of inventory
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((total, variant) => total + (variant.inventory || 0), 0);
  } else {
    this.stock = this.stock || 0;
  }
  //Calculate the final price 
  if (this.promo > 0) {
    this.finalPrice = this.price - (this.price * this.promo) / 100;
  } else {
    this.finalPrice = this.price;
  }
  // Set status based on stock value
  if (this.stock === 0) {
    this.status = "Out of Stock";
  } else if (this.stock > 0 && this.stock <= 10) {
    this.status = "Late Stock";
  } else {
    this.status = "In Stock";
  }


  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
