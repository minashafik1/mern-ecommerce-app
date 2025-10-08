import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Category name must be unique"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [60, "Category name must be at most 60 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: [true, "Category slug must be unique"],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Category description must be at most 300 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false, timestamps: true }
);



const Category = mongoose.model("Category", schema);

export default Category;
