import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'retailer';
    points: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const getInitialState = (): AuthState => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    return {
        user: user ? JSON.parse(user) : null,
        token,
        loading: false,
        error: null,
    };
};

const initialState: AuthState = getInitialState();

interface LoginCredentials {
    email: string;
    password: string;
    role: 'customer' | 'retailer';
}

interface RegisterData extends LoginCredentials {
    name: string;
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { user, token };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', data);
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { user, token };
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Registration failed');
        }
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: { name: string; email: string }, { rejectWithValue }) => {
        try {
            const response = await api.put('/auth/profile', data);
            // Update the user in localStorage
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            return rejectWithValue(err.response?.data?.error || 'Failed to update profile');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updatePoints: (state, action) => {
            if (state.user) {
                state.user.points = action.payload;
                // Update localStorage to persist the change
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Registration failed';
            })
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                // Update localStorage with fresh user data
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Failed to fetch profile';
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || action.error.message || 'Failed to update profile';
            });
    },
});

export const { logout, updatePoints } = authSlice.actions;
export default authSlice.reducer;
