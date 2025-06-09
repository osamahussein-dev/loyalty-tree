import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// Create TypeORM data source
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "loyalty_tree",
    synchronize: false, // Set to false in production
    logging: process.env.NODE_ENV === "development",
    entities: [path.join(__dirname, "../models/**/*.{ts,js}")],
    migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
    subscribers: [path.join(__dirname, "../subscribers/**/*.{ts,js}")],
}); 