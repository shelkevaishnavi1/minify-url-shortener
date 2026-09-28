import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "url_shortener",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // set to console.log if you want to see raw SQL queries
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to XAMPP MySQL via Sequelize.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
};

export default sequelize;
