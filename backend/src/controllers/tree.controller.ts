import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { TreePlanting, User } from "../models/schema";

interface AuthRequest extends Request {
    user?: User;
}

interface MulterRequest extends AuthRequest {
    file?: Express.Multer.File;
}

export const uploadTreePlanting = async (req: MulterRequest, res: Response) => {
    try {
        const { latitude, longitude } = req.body;
        const user = req.user!;

        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Create image URL from the uploaded file
        const imageUrl = `/uploads/${req.file.filename}`;

        // Create tree planting record
        const treePlanting = new TreePlanting();
        treePlanting.imageUrl = imageUrl;
        treePlanting.userId = user.id;
        treePlanting.latitude = parseFloat(latitude);
        treePlanting.longitude = parseFloat(longitude);
        treePlanting.status = "approved"; // Automatically approve

        // Award points to the user (100 points per tree)
        const pointsPerTree = 100;
        user.points += pointsPerTree;

        // Save both the tree planting and updated user points
        await AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(treePlanting);
            await transactionalEntityManager.save(user);
        });

        res.status(201).json({
            treePlanting,
            pointsAwarded: pointsPerTree,
            newTotalPoints: user.points
        });
    } catch (error) {
        console.error("Error uploading tree planting:", error);
        res.status(500).json({ error: "Error uploading tree planting" });
    }
};

export const getMyTreePlantings = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        const treePlantings = await AppDataSource.getRepository(TreePlanting).find({
            where: { userId: user.id },
            order: { createdAt: "DESC" }
        });

        res.json(treePlantings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tree plantings" });
    }
};

export const getPendingTreePlantings = async (req: Request, res: Response) => {
    try {
        const treePlantings = await AppDataSource.getRepository(TreePlanting).find({
            where: { status: "pending" },
            relations: ["user"],
            order: { createdAt: "ASC" }
        });

        res.json(treePlantings);
    } catch (error) {
        res.status(500).json({ error: "Error fetching pending tree plantings" });
    }
};

export const reviewTreePlanting = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        const treePlanting = await AppDataSource.getRepository(TreePlanting).findOne({
            where: { id },
            relations: ["user"]
        });

        if (!treePlanting) {
            return res.status(404).json({ error: "Tree planting not found" });
        }

        treePlanting.status = status;
        treePlanting.rejectionReason = rejectionReason;

        // If approved, award points to the user
        if (status === "approved") {
            const pointsPerTree = parseInt(process.env.POINTS_PER_TREE || "100");
            const user = treePlanting.user;
            user.points += pointsPerTree;
            await AppDataSource.getRepository(User).save(user);
        }

        await AppDataSource.getRepository(TreePlanting).save(treePlanting);

        res.json(treePlanting);
    } catch (error) {
        res.status(500).json({ error: "Error reviewing tree planting" });
    }
};
