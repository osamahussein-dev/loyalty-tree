import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;
