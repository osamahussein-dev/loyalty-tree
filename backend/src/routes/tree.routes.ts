import { Router } from "express";
import { uploadTreePlanting, getMyTreePlantings } from "../controllers/tree.controller";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// User routes
router.post("/", auth, upload.single('image'), uploadTreePlanting);
router.get("/my", auth, getMyTreePlantings);

export default router;
