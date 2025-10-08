import mongoose from "mongoose";
// mongodb://localhost:27017/ProjectNode
//mongodb+srv://mazenragab:mazenragab@cluster0.kg8gdiu.mongodb.net/Project
export const dbConnection = mongoose.connect("mongodb+srv://mazenragab:mazenragab@cluster0.kg8gdiu.mongodb.net/Project")
.then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
});