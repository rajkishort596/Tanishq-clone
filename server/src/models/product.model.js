import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from "uuid";
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
      gst: { type: Number, default: 3 }, // GST/Rate
      gstAmount: { type: Number, default: 0 }, // GST/Taxes amount
      final: { type: Number }, // Final price for display (calculated)
    },
    variants: [
      // For different sizes, metals, or stone variations
      {
        variantId: { type: String }, // SKU for variant
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
    size: {
      type: String,
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
    metalColor: {
      type: String,
      required: true,
    },
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
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.variants = this.variants.map((variant) => {
    if (!variant.variantId) {
      variant.variantId = uuidv4();
    }
    return variant;
  });

  // Calculate GST
  const gstRate = this.price.gst / 100 || 0.03;
  const taxableValue = this.price.base + (this.price.makingCharges || 0);
  const gstAmount = taxableValue * gstRate;
  this.price.gstAmount = gstAmount;
  // Calculate the final price
  this.price.final = taxableValue + gstAmount;
  next();
});

// Plug in the plugin
productSchema.plugin(aggregatePaginate);
productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model("Product", productSchema);
