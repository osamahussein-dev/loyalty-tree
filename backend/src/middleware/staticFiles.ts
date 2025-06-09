import express from 'express';
import path from 'path';
import fs from 'fs';

// Middleware to serve static files from the uploads directory
export const serveStaticFiles = (app: express.Application) => {
    const uploadsPath = path.join(__dirname, '../../uploads');

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
        console.log(`Created uploads directory at ${uploadsPath}`);
    }

    console.log(`Serving static files from ${uploadsPath}`);
    app.use('/uploads', express.static(uploadsPath));
};
