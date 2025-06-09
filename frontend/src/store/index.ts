import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import voucherReducer from './slices/voucherSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        vouchers: voucherReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
