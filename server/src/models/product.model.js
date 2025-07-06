import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      base: { type: Number, required: true }, // Base price
      makingCharges: { type: Number, default: 0 }, // Making charges
      gst: { type: Number, default: 0 }, // GST/Taxes amount
      final: { type: Number, required: true }, // Final price for display (calculated)
    },
    variants: [
      // For different sizes, metals, or stone variations
      {
        variantId: { type: String, unique: true, sparse: true }, // SKU for variant
        size: { type: String },
        metalColor: { type: String }, // e.g., White Gold, Rose Gold
        priceAdjustment: { type: Number, default: 0 }, // Price difference from base
        stock: { type: Number, default: 0 },
      },
    ],
    collections: [
      {
        // Tanishq's sub-brands or special collections (e.g., Rivaah, Mia)
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
        default: null,
      },
    ],
    occasion: [
      {
        // Wedding, Daily Wear, Party
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    metal: {
      type: String,
      required: true,
    }, // Gold, Diamond, etc.
    purity: {
      type: String,
      required: true,
    }, // 18K, 22K
    gender: {
      type: String,
      required: true,
      enum: ["men", "women", "kids", "unisex"],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const Product = mongoose.model("Product", productSchema);
