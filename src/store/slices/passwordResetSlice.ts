import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface PasswordResetState {
  email: string | null;
  resetToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: PasswordResetState = {
  email: null,
  resetToken: null,
  loading: false,
  error: null,
  message: null,
};

// Async thunk for forgot password
export const forgotPassword = createAsyncThunk<
  { message: string; detail: string },
  { email: string },
  { rejectValue: string }
>(
  'passwordReset/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/forgot-password/', { email });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to send reset email';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for verify reset code (OTP)
export const verifyResetCode = createAsyncThunk<
  { message: string; reset_token: string; detail: string },
  { email: string; code: string },
  { rejectValue: string }
>(
  'passwordReset/verifyResetCode',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/verify-reset-code/', { email, code });
      return response.data;
    } catch (error) {
      let errorMessage = 'Invalid or expired code';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for resend reset code
export const resendResetCode = createAsyncThunk<
  { message: string; detail?: string },
  { email: string },
  { rejectValue: string }
>(
  'passwordReset/resendResetCode',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/resend-reset-code/', { email });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to resend code';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for reset password
export const resetPassword = createAsyncThunk<
  { message: string; detail?: string },
  { reset_token: string; new_password: string; confirm_password: string },
  { rejectValue: string }
>(
  'passwordReset/resetPassword',
  async ({ reset_token, new_password, confirm_password }, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/reset-password/', {
        reset_token,
        new_password,
        confirm_password,
      });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to reset password';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearPasswordResetState: (state) => {
      state.email = null;
      state.resetToken = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message || action.payload.detail;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to send reset email';
    });

    // Verify Reset Code
    builder.addCase(verifyResetCode.pending, (state) => {
      state.loading = true;
      state.error = null;
      // Don't clear message here to prevent extra re-renders
    });
    builder.addCase(verifyResetCode.fulfilled, (state, action) => {
      state.loading = false;
      state.resetToken = action.payload.reset_token;
      state.message = action.payload.message || action.payload.detail;
    });
    builder.addCase(verifyResetCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Invalid or expired code';
      state.message = null;
    });

    // Resend Reset Code
    builder.addCase(resendResetCode.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(resendResetCode.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message || action.payload.detail || 'Code sent successfully';
    });
    builder.addCase(resendResetCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to resend code';
    });

    // Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message || action.payload.detail || 'Password reset successfully';
      // Clear state after successful reset
      state.email = null;
      state.resetToken = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to reset password';
    });
  },
});

export const { setEmail, clearPasswordResetState, clearError, clearMessage } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
