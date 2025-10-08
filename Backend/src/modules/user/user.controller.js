import User from "../../../database/models/user.model.js";
import { AppError } from "../../../utils/appErorr.js";
import catchError from "../../Middleware/catchError.js";


// ================== Update Profile ==================
export const updateProfile = catchError(async (req, res, next) => {
  const { name, username, email, age } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));

  if (name) user.name = name;
  if (username) user.username = username;
  if (email) {
    const exists = await User.findOne({ email });
    if (exists && exists._id.toString() !== user._id.toString()) {
      return next(new AppError("Email is already in use", 409));
    }
    user.email = email;
  }
  if (age) user.age = age;

  await user.save();

  res.status(200).json({ message: "Profile updated successfully", user });
});

