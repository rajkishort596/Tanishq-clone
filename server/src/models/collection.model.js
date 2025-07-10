import mongoose, { Schema } from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Collection names should be unique
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      // Main image for the collection, as seen in your screenshot
      url: { type: String, trim: true },
      publicId: { type: String, trim: true },
    },
    bannerImage: {
      // Optional: Larger banner image for collection landing pages
      url: { type: String, trim: true },
      publicId: { type: String, trim: true },
    },
    startDate: {
      // When the collection was launched
      type: Date,
      default: Date.now,
    },
    endDate: {
      // If it's a limited-time collection
      type: Date,
      default: null,
    },
    isActive: {
      // To easily enable/disable a collection from being displayed
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Plug in the plugin
collectionSchema.plugin(mongoosePaginate);

export const Collection = mongoose.model("Collection", collectionSchema);
