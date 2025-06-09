import { AppDataSource } from "../config/database";

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connection initialized");
    } catch (error) {
        console.error("Error initializing database connection:", error);
        throw error;
    }
}; 