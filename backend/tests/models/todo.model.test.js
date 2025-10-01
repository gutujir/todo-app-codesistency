import mongoose from "mongoose";
import todoModel from "../../src/models/todo.model.js";

describe("Todo Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-todo-model", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await todoModel.deleteMany();
  });

  it("should create and save a todo successfully", async () => {
    const todoData = {
      title: "Test Todo",
      description: "Test description",
      user: new mongoose.Types.ObjectId(),
    };
    const todo = new todoModel(todoData);
    const savedTodo = await todo.save();
    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.title).toBe(todoData.title);
    expect(savedTodo.description).toBe(todoData.description);
    expect(savedTodo.status).toBe("pending");
    expect(savedTodo.user.toString()).toBe(todoData.user.toString());
    expect(savedTodo.createdAt).toBeInstanceOf(Date);
    expect(savedTodo.updatedAt).toBeInstanceOf(Date);
  });

  it("should require title and user", async () => {
    const todo = new todoModel({});
    let err;
    try {
      await todo.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.user).toBeDefined();
  });

  it("should only allow valid status values", async () => {
    const todo = new todoModel({
      title: "Invalid Status",
      user: new mongoose.Types.ObjectId(),
      status: "not-valid",
    });
    let err;
    try {
      await todo.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.status).toBeDefined();
  });

  it("should set default status to 'pending'", async () => {
    const todo = new todoModel({
      title: "Default Status",
      user: new mongoose.Types.ObjectId(),
    });
    const savedTodo = await todo.save();
    expect(savedTodo.status).toBe("pending");
  });

  it("should allow status to be set to 'completed' or 'deleted'", async () => {
    const userId = new mongoose.Types.ObjectId();
    const completed = new todoModel({
      title: "Completed Todo",
      user: userId,
      status: "completed",
    });
    const deleted = new todoModel({
      title: "Deleted Todo",
      user: userId,
      status: "deleted",
    });
    const savedCompleted = await completed.save();
    const savedDeleted = await deleted.save();
    expect(savedCompleted.status).toBe("completed");
    expect(savedDeleted.status).toBe("deleted");
  });
});
