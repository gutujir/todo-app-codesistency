import todoModel from "../models/todo.model.js";

export const getSingleTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await todoModel.findOne({ _id: id, user: req.userId });
    if (!todo)
      return res.json({
        success: false,
        message: "Todo not found or not authorized",
      });
    res.json({ success: true, todo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createTodo = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.json({ success: false, message: "Title is required" });
  try {
    const todo = new todoModel({ title, description, user: req.userId });
    await todo.save();
    res.json({ success: true, todo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getTodos = async (req, res) => {
  const { status } = req.query;
  try {
    const filter = { user: req.userId };
    if (status) filter.status = status;
    const todos = await todoModel.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, todos });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const todo = await todoModel.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: { title, description } },
      { new: true }
    );
    if (!todo)
      return res.json({
        success: false,
        message: "Todo not found or not authorized",
      });
    res.json({ success: true, todo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["pending", "completed", "deleted"].includes(status)) {
    return res.json({ success: false, message: "Invalid status" });
  }
  try {
    const todo = await todoModel.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: { status } },
      { new: true }
    );
    if (!todo)
      return res.json({
        success: false,
        message: "Todo not found or not authorized",
      });
    res.json({ success: true, todo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await todoModel.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: { status: "deleted" } },
      { new: true }
    );
    if (!todo)
      return res.json({
        success: false,
        message: "Todo not found or not authorized",
      });
    res.json({ success: true, todo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
