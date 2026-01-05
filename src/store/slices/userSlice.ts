import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Types
export interface User {
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
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface Role {
  value: string;
  display: string;
}

interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

interface UserState {
  users: User[];
  roles: Role[];
  usersByRole: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

// Initial state
const initialState: UserState = {
  users: [],
  roles: [],
  usersByRole: [],
  currentUser: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<UsersResponse>("/users/");
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch users"
      );
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "users/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ roles: Role[] }>("/users/roles/");
      return response.data.roles;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch roles"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      password_confirm: string;
      first_name: string;
      last_name: string;
      role: string;
      phone_number?: string;
      whatsapp_number?: string;
      department?: string;
      organization?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/users", userData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail ||
          "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    {
      userId,
      userData,
    }: {
      userId: number;
      userData: Partial<User>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/users/${userId}/`, userData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to update user"
      );
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async (
    { userId, isActive }: { userId: number; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = isActive
        ? `/users/${userId}/deactivate/`
        : `/users/${userId}/activate/`;
      await api.post(endpoint);
      return { userId, isActive: !isActive };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to toggle user status"
      );
    }
  }
);

export const fetchUsersByRole = createAsyncThunk(
  "users/fetchUsersByRole",
  async (role: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/by_role/?role=${role}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch users by role"
      );
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create User
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle User Status
    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const user = state.users.find((u) => u.id === action.payload.userId);
        if (user) {
          user.is_active = action.payload.isActive;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Users By Role
    builder
      .addCase(fetchUsersByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.usersByRole = action.payload.users || [];
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
