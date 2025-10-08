import mongoose from "mongoose";


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: { 
    type: String, 
    required: true, 
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
}, { timestamps: true, versionKey: false });




const User = mongoose.model("User", schema);

export default User;
