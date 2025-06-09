import { store } from '../store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'retailer';
    points: number;
} 