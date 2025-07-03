import mongoose, { Schema } from "mongoose";
const bannerSchema = new Schema({
  image: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  altText: String,
  link: String,
  title: String,
  active: {
    type: Boolean,
    default: true,
  },
});
export const Banner = mongoose.model("Banner", bannerSchema);
