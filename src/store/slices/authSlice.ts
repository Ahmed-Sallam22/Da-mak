import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number: string | null;
  whatsapp_number: string | null;
  department: string | null;
  organization_id: number;
  organization_name: string;
  is_active: boolean;
  date_joined: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

// Load initial state from localStorage
const loadAuthFromStorage = (): Pick<AuthState, 'isAuthenticated' | 'user' | 'accessToken' | 'refreshToken'> => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      isAuthenticated: !!accessToken && !!user,
      user,
      accessToken,
      refreshToken,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }
};

const initialState: AuthState = {
  ...loadAuthFromStorage(),
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>('auth/login/', credentials);
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      
      return response.data;
    } catch (error) {
      let errorMessage = 'Invalid username or password';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for refresh token
export const refreshAccessToken = createAsyncThunk<{ access: string }, void, { rejectValue: string }>(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ access: string }>('auth/refresh/', {
        refresh: refreshToken,
      });

      localStorage.setItem('access_token', response.data.access);
      return response.data;
    } catch {
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    });

    // Refresh token
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.access;
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
