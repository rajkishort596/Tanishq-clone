import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
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
bannerSchema.plugin(mongoosePaginate);
export const Banner = mongoose.model("Banner", bannerSchema);
