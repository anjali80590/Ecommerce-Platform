const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    mrp: { type: Number },
    currency: { type: String, default: "INR" },
    rating: { type: Number, default: 0 },
    unitsSold: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    returnRate: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    metadata: {
      ram: String,
      storage: String,
      screensize: String,
      color: String,
      model: String,
      brightness: String,
    },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
