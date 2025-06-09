import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
    createVoucher,
    getAvailableVouchers,
    redeemVoucher,
    getMyVoucherRedemptions,
    getRetailerVouchers,
    updateVoucher,
    deleteVoucher,
    getRetailerStats
} from "../controllers/voucher.controller";
import { auth, requireRole } from "../middleware/auth";

// Set up multer for file uploads
const uploadsDir = path.join(__dirname, "../../uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb: multer.FileFilterCallback) {
        // Accept only images
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(null, false);
        }
        cb(null, true);
    }
});

const router = Router();

// Public routes
router.get("/available", getAvailableVouchers);

// User routes
router.post("/redeem", auth, redeemVoucher);
router.get("/my-redemptions", auth, getMyVoucherRedemptions);

// Retailer routes
router.post("/", auth, requireRole(["retailer"]), upload.single("image"), createVoucher);
router.get("/retailer", auth, requireRole(["retailer"]), getRetailerVouchers);
router.put("/:id", auth, requireRole(["retailer"]), upload.single("image"), updateVoucher);
router.delete("/:id", auth, requireRole(["retailer"]), deleteVoucher);
router.get("/retailer/stats", auth, requireRole(["retailer"]), getRetailerStats);

export default router;
