import { Request, Response, NextFunction } from "express";
import { User, Retailer } from "../models/schema";
import { verifyJwt } from "../utils/jwt";

interface AuthRequest extends Request {
    user?: User | Retailer;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const user = await verifyJwt(token);
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Set the role property for retailers
        if ('description' in user) {
            (user as any).role = 'retailer';
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
};

export const requireRole = (roles: ("user" | "retailer" | "admin")[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // For retailers
        if ('description' in user) {
            if (roles.includes('retailer')) {
                return next();
            }
        }
        // For regular users
        else if ('points' in user) {
            if (roles.includes((user as User).role)) {
                return next();
            }
        }

        return res.status(403).json({ error: "Access denied" });
    };
};
