import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Voucher, VoucherRedemption, User, Retailer } from "../models/schema";
import { MoreThan } from "typeorm";

interface AuthRequest extends Request {
    user?: User;
}

export const createVoucher = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Check if the user is a retailer
        const isRetailer = req.user.role === 'retailer';
        if (!isRetailer) {
            return res.status(403).json({ error: "Only retailers can access this endpoint" });
        }

        const retailerId = req.user.id;

        const { title, description, pointsRequired, quantity, expiryDate } = req.body;

        console.log("Creating voucher with data:", {
            title,
            description,
            pointsRequired,
            quantity,
            expiryDate,
            file: req.file ? req.file.filename : 'No file'
        });

        // Handle image upload if present
        let imageUrl = null;
        if (req.file) {
            // Create a full URL for the image
            const host = req.get('host');
            const protocol = req.protocol;
            imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
            console.log("Image URL set to:", imageUrl);
        }

        const voucher = new Voucher();
        voucher.title = title;
        voucher.description = description;
        voucher.pointsRequired = parseInt(pointsRequired, 10);
        voucher.quantity = parseInt(quantity, 10);
        voucher.expiryDate = new Date(expiryDate);
        voucher.retailerId = retailerId;

        if (imageUrl) {
            voucher.imageUrl = imageUrl;
        }

        await AppDataSource.getRepository(Voucher).save(voucher);

        res.status(201).json(voucher);
    } catch (error) {
        console.error("Error creating voucher:", error);
        res.status(500).json({ error: "Error creating voucher" });
    }
};

export const getAvailableVouchers = async (req: Request, res: Response) => {
    try {
        const currentDate = new Date();
        const vouchers = await AppDataSource.getRepository(Voucher).find({
            where: {
                quantity: MoreThan(0),
                expiryDate: MoreThan(currentDate)
            },
            relations: ["retailer"],
            order: { pointsRequired: "ASC" }
        });

        // Add default image URL for vouchers that don't have one
        const vouchersWithImages = vouchers.map(voucher => {
            if (!voucher.imageUrl) {
                return {
                    ...voucher,
                    imageUrl: `https://source.unsplash.com/random/300x200?nature,${Math.floor(Math.random() * 100)}`
                };
            }
            return voucher;
        });

        res.json(vouchersWithImages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching vouchers" });
    }
};

export const redeemVoucher = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        const { voucherId } = req.body;

        const voucher = await AppDataSource.getRepository(Voucher).findOne({
            where: { id: voucherId },
            relations: ["retailer"]
        });

        if (!voucher) {
            return res.status(404).json({ error: "Voucher not found" });
        }

        if (voucher.quantity <= 0) {
            return res.status(400).json({ error: "Voucher out of stock" });
        }

        if (voucher.expiryDate < new Date()) {
            return res.status(400).json({ error: "Voucher has expired" });
        }

        if (user.points < voucher.pointsRequired) {
            return res.status(400).json({ error: "Insufficient points" });
        }

        // Generate unique redemption code
        const generateRedemptionCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = 'VR-';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        let redemptionCode = generateRedemptionCode();

        // Ensure uniqueness
        let existingRedemption = await AppDataSource.getRepository(VoucherRedemption).findOne({
            where: { redemptionCode }
        });

        while (existingRedemption) {
            redemptionCode = generateRedemptionCode();
            existingRedemption = await AppDataSource.getRepository(VoucherRedemption).findOne({
                where: { redemptionCode }
            });
        }

        // Create redemption record
        const redemption = new VoucherRedemption();
        redemption.userId = user.id;
        redemption.voucherId = voucher.id;
        redemption.pointsSpent = voucher.pointsRequired;
        redemption.status = "active";
        redemption.redemptionCode = redemptionCode;

        // Set expiry date (30 days from now or voucher expiry, whichever is sooner)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        redemption.expiresAt = voucher.expiryDate < thirtyDaysFromNow ? voucher.expiryDate : thirtyDaysFromNow;

        // Update user points
        user.points -= voucher.pointsRequired;

        // Update voucher quantity
        voucher.quantity -= 1;

        await AppDataSource.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(redemption);
            await transactionalEntityManager.save(user);
            await transactionalEntityManager.save(voucher);
        });

        // Return redemption with voucher details
        const redemptionWithVoucher = {
            ...redemption,
            voucher: {
                id: voucher.id,
                title: voucher.title,
                description: voucher.description,
                retailer: voucher.retailer
            }
        };

        res.json({
            redemption: redemptionWithVoucher,
            remainingPoints: user.points
        });
    } catch (error) {
        console.error("Error redeeming voucher:", error);
        res.status(500).json({ error: "Error redeeming voucher" });
    }
};

export const getMyVoucherRedemptions = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!;
        const redemptions = await AppDataSource.getRepository(VoucherRedemption).find({
            where: { userId: user.id },
            relations: ["voucher", "voucher.retailer"],
            order: { createdAt: "DESC" }
        });

        res.json(redemptions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching redemptions" });
    }
};

// Retailer endpoints
export const getRetailerVouchers = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Check if the user is a retailer
        const isRetailer = req.user.role === 'retailer';
        if (!isRetailer) {
            return res.status(403).json({ error: "Only retailers can access this endpoint" });
        }

        const retailerId = req.user.id;
        console.log("Fetching vouchers for retailer ID:", retailerId);

        const vouchers = await AppDataSource.getRepository(Voucher).find({
            where: { retailerId },
            relations: ["retailer"],
            order: { createdAt: "DESC" }
        });

        console.log("Found vouchers:", vouchers.length);

        // Add default image URL for vouchers that don't have one
        const vouchersWithImages = vouchers.map(voucher => {
            if (!voucher.imageUrl) {
                return {
                    ...voucher,
                    imageUrl: `https://source.unsplash.com/random/300x200?nature,${Math.floor(Math.random() * 100)}`
                };
            }
            return voucher;
        });

        res.json(vouchersWithImages);
    } catch (error) {
        console.error("Error fetching retailer vouchers:", error);
        res.status(500).json({ error: "Error fetching retailer vouchers" });
    }
};

export const updateVoucher = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Check if the user is a retailer
        const isRetailer = req.user.role === 'retailer';
        if (!isRetailer) {
            return res.status(403).json({ error: "Only retailers can access this endpoint" });
        }

        const retailerId = req.user.id;
        const { id } = req.params;
        const { title, description, pointsRequired, quantity, expiryDate } = req.body;

        const voucherRepo = AppDataSource.getRepository(Voucher);
        const voucher = await voucherRepo.findOne({
            where: { id, retailerId }
        });

        if (!voucher) {
            return res.status(404).json({ error: "Voucher not found or you don't have permission to update it" });
        }

        console.log("Updating voucher with data:", {
            id,
            title,
            description,
            pointsRequired,
            quantity,
            expiryDate,
            file: req.file ? req.file.filename : 'No file'
        });

        // Update voucher properties
        voucher.title = title || voucher.title;
        voucher.description = description || voucher.description;
        voucher.pointsRequired = pointsRequired ? parseInt(pointsRequired, 10) : voucher.pointsRequired;
        voucher.quantity = quantity !== undefined ? parseInt(quantity, 10) : voucher.quantity;
        voucher.expiryDate = expiryDate ? new Date(expiryDate) : voucher.expiryDate;

        // Handle image upload if present
        if (req.file) {
            // Create a full URL for the image
            const host = req.get('host');
            const protocol = req.protocol;
            voucher.imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
            console.log("Image URL updated to:", voucher.imageUrl);
        }

        await voucherRepo.save(voucher);

        res.json(voucher);
    } catch (error) {
        console.error("Error updating voucher:", error);
        res.status(500).json({ error: "Error updating voucher" });
    }
};

export const deleteVoucher = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Check if the user is a retailer
        const isRetailer = req.user.role === 'retailer';
        if (!isRetailer) {
            return res.status(403).json({ error: "Only retailers can access this endpoint" });
        }

        const retailerId = req.user.id;
        const { id } = req.params;

        const voucherRepo = AppDataSource.getRepository(Voucher);
        const voucher = await voucherRepo.findOne({
            where: { id, retailerId }
        });

        if (!voucher) {
            return res.status(404).json({ error: "Voucher not found or you don't have permission to delete it" });
        }

        await voucherRepo.remove(voucher);

        res.json({ message: "Voucher deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting voucher" });
    }
};

export const getRetailerStats = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Check if the user is a retailer
        const isRetailer = req.user.role === 'retailer';
        if (!isRetailer) {
            return res.status(403).json({ error: "Only retailers can access this endpoint" });
        }

        const retailerId = req.user.id;
        console.log("Fetching stats for retailer ID:", retailerId);

        // Get active vouchers count
        const activeVouchersCount = await AppDataSource.getRepository(Voucher).count({
            where: {
                retailerId,
                quantity: MoreThan(0),
                expiryDate: MoreThan(new Date())
            }
        });

        // Get total redemptions count
        const redemptionsQuery = await AppDataSource
            .createQueryBuilder()
            .select("COUNT(*)", "totalRedemptions")
            .addSelect("SUM(vr.pointsSpent)", "totalPointsRedeemed")
            .from(VoucherRedemption, "vr")
            .innerJoin("vr.voucher", "v")
            .where("v.retailerId = :retailerId", { retailerId })
            .getRawOne();

        const totalRedemptions = parseInt(redemptionsQuery.totalRedemptions) || 0;
        const totalPointsRedeemed = parseInt(redemptionsQuery.totalPointsRedeemed) || 0;

        console.log("Retailer stats:", {
            activeVouchers: activeVouchersCount,
            totalRedemptions,
            totalPointsRedeemed
        });

        res.json({
            activeVouchers: activeVouchersCount,
            totalRedemptions,
            totalPointsRedeemed
        });
    } catch (error) {
        console.error("Error fetching retailer statistics:", error);
        res.status(500).json({ error: "Error fetching retailer statistics" });
    }
};
