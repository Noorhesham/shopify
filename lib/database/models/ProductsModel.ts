import mongoose, { Document, Schema } from "mongoose";
export interface ProductImage {
  imgUrl: string;
  publicId: string;
}
export interface ProductProps extends Document {
  name: string;
  price: number;
  stock: number;
  description: string;
  images: ProductImage[];
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  brand: string;
  subCategories: [mongoose.Types.ObjectId];
  reviews: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  rating: number;
  published: boolean;
  variations: {
    variation: mongoose.Types.ObjectId;
    options: {
      variationOption: mongoose.Types.ObjectId;
      price: number;
      images: ProductImage[];
    }[];
  }[];
  numReviews: number;
  step: number;
}
const ProductSchema = new Schema<ProductProps>(
  {
    name: { type: String, default: "user" },
    step: { type: Number, default: 1 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    images: { type: [{ imgUrl: String, publicId: String }], default: [] },
    brand: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategories: { type: [Schema.Types.ObjectId], ref: "SubCategory" },
    createdAt: { type: Date, default: Date.now },
    reviews: { type: Schema.Types.ObjectId, ref: "Review" },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    numReviews: { type: Number, default: 0, required: true },
    variations: [
      {
        variation: { type: Schema.Types.ObjectId, ref: "Variation" },
        options: [
          {
            variationOption: { type: Schema.Types.ObjectId, ref: "VariationOption" },
            price: { type: Number, required: true },
            images: { type: [{ imgUrl: String, publicId: String }], default: [] },
          },
        ],
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.pre(/^find/, function (this: any, next) {
  this.populate("category");
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
