import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        name: { type: String, required: true },
        productPrice: { type: Number, required: true },
        finalPrice: { type: Number, required: true },
      },
    ],

    totalPrice: {
      type: Number,
      default: 1,
    },
    paymentMethod: {
      type: String,
      default: "cash",
      enum: ["cash", "card"],
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "placed",
        "on way",
        "deliverd",
        "cancelled",
        "rejected",
        "payment failed",
      ],
    },
    paymentIntentId: {
      type: String,
      unique: true,
      sparse: true, 
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
