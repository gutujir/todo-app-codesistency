import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const todoModel = mongoose.models.todo || mongoose.model("todo", todoSchema);
export default todoModel;
