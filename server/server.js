import express from "express";
import dotenv from "dotenv";
import sequelize, { connectDB } from "./src/config/db.js";
import router from "./src/routers/route.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }),
);
app.use("/", router);
// Basic test route
app.get("/", (req, res) => {
  res.send("URL Shortener API is running...");
});

// Start server after verifying database connection
const startServer = async () => {
  try {
    // 1. Authenticate with MySQL in XAMPP
    await connectDB();

    // 2. Sync models with database
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");

    // 3. Start listening for incoming requests
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
