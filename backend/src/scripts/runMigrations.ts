import { AppDataSource } from "../config/database";

const runMigrations = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Running migrations...");

        await AppDataSource.runMigrations();
        console.log("Migrations completed successfully");

        await AppDataSource.destroy();
    } catch (error) {
        console.error("Error running migrations:", error);
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(1);
    }
    process.exit(0);
};

runMigrations(); 