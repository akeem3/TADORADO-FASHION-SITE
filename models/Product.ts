import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  ageGroup: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  image: { type: String, required: true },
  hoverImage: { type: String },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
