import express from "express";

import {
  createTodo,
  getTodos,
  updateTodo,
  changeStatus,
  deleteTodo,
  getSingleTodo,
} from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const todoRouter = express.Router();

todoRouter.post("/", verifyToken, createTodo);
todoRouter.get("/", verifyToken, getTodos);
todoRouter.get("/:id", verifyToken, getSingleTodo);
todoRouter.patch("/:id", verifyToken, updateTodo);
todoRouter.patch("/:id/status", verifyToken, changeStatus);
todoRouter.delete("/:id", verifyToken, deleteTodo);

export default todoRouter;
