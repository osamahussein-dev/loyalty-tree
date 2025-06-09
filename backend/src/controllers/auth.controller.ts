import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User, Retailer } from "../models/schema";
import * as bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt";

interface AuthRequest extends Request {
    user?: User | Retailer;
}

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role } = req.body;

        // Check if email already exists in either users or retailers
        const existingUser = await AppDataSource.getRepository(User).findOne({
            where: { email }
        });
        const existingRetailer = await AppDataSource.getRepository(Retailer).findOne({
            where: { email }
        });

        if (existingUser || existingRetailer) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'customer') {
            // Create new user
            const user = new User();
            user.email = email;
            user.password = hashedPassword;
            user.name = name;
            user.role = "user";
            await AppDataSource.getRepository(User).save(user);

            // Generate token
            const token = signJwt({ id: user.id, type: 'user' });

            return res.status(201).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    points: user.points
                },
                token
            });
        } else {
            // Create new retailer
            const retailer = new Retailer();
            retailer.email = email;
            retailer.password = hashedPassword;
            retailer.name = name;
            await AppDataSource.getRepository(Retailer).save(retailer);

            // Generate token
            const token = signJwt({ id: retailer.id, type: 'retailer' });

            return res.status(201).json({
                user: {
                    id: retailer.id,
                    email: retailer.email,
                    name: retailer.name,
                    role: 'retailer'
                },
                token
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Error registering user" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        let user: User | Retailer | null = null;
        let type: 'user' | 'retailer' = 'user';

        if (role === 'customer') {
            user = await AppDataSource.getRepository(User).findOne({
                where: { email }
            });
            type = 'user';
        } else {
            user = await AppDataSource.getRepository(Retailer).findOne({
                where: { email }
            });
            type = 'retailer';
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate token
        const token = signJwt({ id: user.id, type });

        // Prepare response based on user type
        const responseUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: type === 'user' ? (user as User).role : 'retailer',
            ...(type === 'user' && { points: (user as User).points })
        };

        res.json({
            user: responseUser,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Error logging in" });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Check if it's a regular user or retailer
        const isUser = 'points' in user;

        const profile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: isUser ? (user as User).role : 'retailer',
            ...(isUser && { points: (user as User).points })
        };

        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: "Error fetching profile" });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { name, email } = req.body;

        // Check if it's a regular user or retailer
        const isUser = 'points' in user;

        if (isUser) {
            // Update user
            const userRepository = AppDataSource.getRepository(User);
            await userRepository.update(user.id, {
                name: name || user.name,
                email: email || user.email
            });

            // Get updated user
            const updatedUser = await userRepository.findOne({
                where: { id: user.id }
            });

            if (!updatedUser) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json({
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                points: updatedUser.points
            });
        } else {
            // Update retailer
            const retailerRepository = AppDataSource.getRepository(Retailer);
            await retailerRepository.update(user.id, {
                name: name || user.name,
                email: email || user.email
            });

            // Get updated retailer
            const updatedRetailer = await retailerRepository.findOne({
                where: { id: user.id }
            });

            if (!updatedRetailer) {
                return res.status(404).json({ error: "Retailer not found" });
            }

            return res.json({
                id: updatedRetailer.id,
                email: updatedRetailer.email,
                name: updatedRetailer.name,
                role: 'retailer'
            });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: "Error updating profile" });
    }
};
