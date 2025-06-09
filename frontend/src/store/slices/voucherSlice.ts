import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Types
export interface Retailer {
    id: string;
    name: string;
    email: string;
    description?: string;
    logo?: string;
}

export interface Voucher {
    id: string;
    title: string;
    description: string;
    pointsRequired: number;
    quantity: number;
    expiryDate: string;
    imageUrl?: string;
    retailerId: string;
    retailer?: Retailer;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherRedemption {
    id: string;
    userId: string;
    voucherId: string;
    status: 'active' | 'used' | 'expired';
    pointsSpent: number;
    redemptionCode: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    voucher: {
        id: string;
        title: string;
        description: string;
        retailer: Retailer;
    };
}

export interface RetailerStats {
    activeVouchers: number;
    totalRedemptions: number;
    totalPointsRedeemed: number;
}

interface VoucherState {
    vouchers: Voucher[];
    redemptions: VoucherRedemption[];
    stats: RetailerStats | null;
    loading: boolean;
    error: string | null;
}

const initialState: VoucherState = {
    vouchers: [] as Voucher[],
    redemptions: [] as VoucherRedemption[],
    stats: null,
    loading: false,
    error: null,
};

// Async thunks
export const fetchRetailerVouchers = createAsyncThunk(
    'vouchers/fetchRetailerVouchers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/vouchers/retailer');
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch vouchers');
        }
    }
);

export const fetchRetailerStats = createAsyncThunk(
    'vouchers/fetchRetailerStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/vouchers/retailer/stats');
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch stats');
        }
    }
);

export const createVoucher = createAsyncThunk(
    'vouchers/createVoucher',
    async (voucherData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post('/vouchers', voucherData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to create voucher');
        }
    }
);

export const updateVoucher = createAsyncThunk(
    'vouchers/updateVoucher',
    async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/vouchers/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to update voucher');
        }
    }
);

export const deleteVoucher = createAsyncThunk(
    'vouchers/deleteVoucher',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/vouchers/${id}`);
            return id;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to delete voucher');
        }
    }
);

export const redeemVoucher = createAsyncThunk(
    'vouchers/redeemVoucher',
    async (voucherId: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/vouchers/redeem', { voucherId });
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to redeem voucher');
        }
    }
);

export const fetchMyRedemptions = createAsyncThunk(
    'vouchers/fetchMyRedemptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/vouchers/my-redemptions');
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch redemptions');
        }
    }
);

// Slice
const voucherSlice = createSlice({
    name: 'vouchers',
    initialState,
    reducers: {
        clearVoucherError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch retailer vouchers
            .addCase(fetchRetailerVouchers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRetailerVouchers.fulfilled, (state, action: PayloadAction<Voucher[]>) => {
                state.loading = false;
                state.vouchers = action.payload;
            })
            .addCase(fetchRetailerVouchers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch retailer stats
            .addCase(fetchRetailerStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRetailerStats.fulfilled, (state, action: PayloadAction<RetailerStats>) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchRetailerStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create voucher
            .addCase(createVoucher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVoucher.fulfilled, (state, action: PayloadAction<Voucher>) => {
                state.loading = false;
                state.vouchers.unshift(action.payload);
            })
            .addCase(createVoucher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update voucher
            .addCase(updateVoucher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateVoucher.fulfilled, (state, action: PayloadAction<Voucher>) => {
                state.loading = false;
                const index = state.vouchers.findIndex(v => v.id === action.payload.id);
                if (index !== -1) {
                    state.vouchers[index] = action.payload;
                }
            })
            .addCase(updateVoucher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete voucher
            .addCase(deleteVoucher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVoucher.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.vouchers = state.vouchers.filter(v => v.id !== action.payload);
            })
            .addCase(deleteVoucher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Redeem voucher
            .addCase(redeemVoucher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(redeemVoucher.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new redemption to the list
                state.redemptions.unshift(action.payload.redemption);
            })
            .addCase(redeemVoucher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch my redemptions
            .addCase(fetchMyRedemptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyRedemptions.fulfilled, (state, action: PayloadAction<VoucherRedemption[]>) => {
                state.loading = false;
                state.redemptions = action.payload;
            })
            .addCase(fetchMyRedemptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearVoucherError } = voucherSlice.actions;
export default voucherSlice.reducer;
