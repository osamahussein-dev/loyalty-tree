import jwt from 'jsonwebtoken';
import { User, Retailer } from '../models/schema';
import { AppDataSource } from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
    id: string;
    type: 'user' | 'retailer';
}

export const signJwt = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyJwt = async (token: string): Promise<User | Retailer | null> => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (decoded.type === 'user') {
            return await AppDataSource.getRepository(User).findOne({
                where: { id: decoded.id }
            });
        } else {
            return await AppDataSource.getRepository(Retailer).findOne({
                where: { id: decoded.id }
            });
        }
    } catch (error) {
        return null;
    }
}; 