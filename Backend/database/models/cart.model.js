import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
  },
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, min: 1 , default: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  totalCartPrice: { type: Number, default: 0 },
}, { versionKey: false, timestamps: true });

const Cart = mongoose.model("Cart", schema);
export default Cart;
