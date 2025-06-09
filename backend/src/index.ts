import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./utils/database";
import authRoutes from "./routes/auth.routes";
import treeRoutes from "./routes/tree.routes";
import voucherRoutes from "./routes/voucher.routes";
import { serveStaticFiles } from "./middleware/staticFiles";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const localhostRegex = /^http:\/\/localhost:\d+$/;
        if (localhostRegex.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());

// Serve static files
serveStaticFiles(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trees", treeRoutes);
app.use("/api/vouchers", voucherRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error);
        process.exit(1);
    });
