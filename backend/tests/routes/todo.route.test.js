import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import { connect, closeDatabase, clearDatabase } from "../setup/mongodb.js";

// ESM-safe mock for sendEmail
jest.unstable_mockModule("../../src/resend/resendEmail.js", () => ({
  ...jest.requireActual("../../src/resend/resendEmail.js"),
  sendEmail: async () => Promise.resolve(),
}));

let authCookie;

beforeAll(async () => {
  await connect();
  // Register and login a user to get auth cookie
  await request(app).post("/api/auth/signup").send({
    email: "todo@example.com",
    password: "password123",
    name: "Todo User",
  });
  // Optionally verify user if your app requires it
  const { User } = await import("../../src/models/user.model.js");
  const user = await User.findOne({ email: "todo@example.com" });
  user.isVerified = true;
  await user.save();
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "todo@example.com",
    password: "password123",
  });
  authCookie = loginRes.headers["set-cookie"];
}, 30000);

afterEach(async () => {
  await clearDatabase();
}, 30000);

afterAll(async () => {
  await closeDatabase();
}, 30000);

describe("Todo API", () => {
  it("should not create a todo with missing title", async () => {
    const res = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ description: "No title" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title/i);
  });

  it("should not allow unauthenticated access to create todo", async () => {
    const res = await request(app).post("/api/todo").send({ title: "No Auth" });
    expect(res.statusCode).toBe(401);
  });

  it("should not allow unauthenticated access to get todos", async () => {
    const res = await request(app).get("/api/todo");
    expect(res.statusCode).toBe(401);
  });

  it("should not allow unauthenticated access to update todo", async () => {
    const res = await request(app)
      .patch("/api/todo/123456789012")
      .send({ title: "No Auth" });
    expect(res.statusCode).toBe(401);
  });

  it("should return not found for updating non-existent todo", async () => {
    const res = await request(app)
      .patch("/api/todo/507f1f77bcf86cd799439011")
      .set("Cookie", authCookie)
      .send({ title: "Doesn't exist" });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should return not found for deleting non-existent todo", async () => {
    const res = await request(app)
      .delete("/api/todo/507f1f77bcf86cd799439011")
      .set("Cookie", authCookie);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should not allow user to access another user's todo", async () => {
    // Create a todo as user1
    const createRes = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "User1 Todo" });
    const todoId = createRes.body.todo._id;
    // Register/login as user2
    await request(app).post("/api/auth/signup").send({
      email: "other@example.com",
      password: "password123",
      name: "Other User",
    });
    const { User } = await import("../../src/models/user.model.js");
    const user2 = await User.findOne({ email: "other@example.com" });
    user2.isVerified = true;
    await user2.save();
    const loginRes2 = await request(app).post("/api/auth/login").send({
      email: "other@example.com",
      password: "password123",
    });
    const authCookie2 = loginRes2.headers["set-cookie"];
    // Try to get user1's todo as user2
    const res = await request(app)
      .get(`/api/todo/${todoId}`)
      .set("Cookie", authCookie2);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not authorized|not found/i);
  });

  it("should not allow user to update another user's todo", async () => {
    // Create a todo as user1
    const createRes = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "User1 Todo" });
    const todoId = createRes.body.todo._id;
    // Register/login as user2
    await request(app).post("/api/auth/signup").send({
      email: "other2@example.com",
      password: "password123",
      name: "Other2 User",
    });
    const { User } = await import("../../src/models/user.model.js");
    const user2 = await User.findOne({ email: "other2@example.com" });
    user2.isVerified = true;
    await user2.save();
    const loginRes2 = await request(app).post("/api/auth/login").send({
      email: "other2@example.com",
      password: "password123",
    });
    const authCookie2 = loginRes2.headers["set-cookie"];
    // Try to update user1's todo as user2
    const res = await request(app)
      .patch(`/api/todo/${todoId}`)
      .set("Cookie", authCookie2)
      .send({ title: "Hacked" });
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not authorized|not found/i);
  });

  it("should return error 500 if db fails on create", async () => {
    // Temporarily mock todoModel.save to throw
    const { default: todoModel } = await import(
      "../../src/models/todo.model.js"
    );
    const origSave = todoModel.prototype.save;
    todoModel.prototype.save = jest.fn().mockImplementation(() => {
      throw new Error("DB error");
    });
    const res = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Should fail" });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/db error/i);
    todoModel.prototype.save = origSave;
  });

  it("should create a todo", async () => {
    const res = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Test Todo", description: "Test Desc" });
    expect(res.statusCode).toBe(201);
    expect(res.body.todo.title).toBe("Test Todo");
  }, 30000);

  it("should get all todos", async () => {
    await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Test Todo", description: "Test Desc" });
    const res = await request(app).get("/api/todo").set("Cookie", authCookie);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos.length).toBeGreaterThan(0);
  }, 30000);

  it("should update a todo", async () => {
    const createRes = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Old Title", description: "Old Desc" });
    const todoId = createRes.body.todo._id;
    const res = await request(app)
      .patch(`/api/todo/${todoId}`)
      .set("Cookie", authCookie)
      .send({ title: "New Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.todo.title).toBe("New Title");
  }, 30000);

  it("should change status of a todo", async () => {
    const createRes = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Status Todo", description: "Desc" });
    const todoId = createRes.body.todo._id;
    const res = await request(app)
      .patch(`/api/todo/${todoId}/status`)
      .set("Cookie", authCookie)
      .send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.todo.status).toBe("completed");
  }, 30000);

  it("should delete a todo", async () => {
    const createRes = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Delete Todo", description: "Desc" });
    const todoId = createRes.body.todo._id;
    const res = await request(app)
      .delete(`/api/todo/${todoId}`)
      .set("Cookie", authCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000);

  it("should get a single todo", async () => {
    const createRes = await request(app)
      .post("/api/todo")
      .set("Cookie", authCookie)
      .send({ title: "Single Todo", description: "Desc" });
    const todoId = createRes.body.todo._id;
    const res = await request(app)
      .get(`/api/todo/${todoId}`)
      .set("Cookie", authCookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.todo._id).toBe(todoId);
  }, 30000);
});
