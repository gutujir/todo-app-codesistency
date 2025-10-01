import { jest } from "@jest/globals";
import {
  getSingleTodo,
  createTodo,
  getTodos,
  updateTodo,
  changeStatus,
  deleteTodo,
} from "../../src/controllers/todo.controller.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("todo.controller", () => {
  describe("createTodo", () => {
    it("should return 400 if title is missing", async () => {
      const req = { body: { description: "desc" }, userId: "user1" };
      const res = mockRes();
      await createTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("getSingleTodo", () => {
    it("should return not found if todo does not exist", async () => {
      const req = { params: { id: "badid" }, userId: "user1" };
      const res = mockRes();
      await getSingleTodo(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("updateTodo", () => {
    it("should return not found if todo does not exist", async () => {
      const req = {
        params: { id: "badid" },
        body: { title: "t" },
        userId: "user1",
      };
      const res = mockRes();
      await updateTodo(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("changeStatus", () => {
    it("should return error for invalid status", async () => {
      const req = {
        params: { id: "id" },
        body: { status: "bad" },
        userId: "user1",
      };
      const res = mockRes();
      await changeStatus(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("deleteTodo", () => {
    it("should return not found if todo does not exist", async () => {
      const req = { params: { id: "badid" }, userId: "user1" };
      const res = mockRes();
      await deleteTodo(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });
});
