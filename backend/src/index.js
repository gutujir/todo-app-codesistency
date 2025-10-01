import app from "./app.js";
import { connectDB } from "./config/connectDB.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
