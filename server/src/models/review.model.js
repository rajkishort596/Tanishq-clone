import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const reviewSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reviewSchema.plugin(mongoosePaginate);
export const Review = mongoose.model("Review", reviewSchema);
