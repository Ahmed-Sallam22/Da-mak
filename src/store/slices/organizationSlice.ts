import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Types
export interface Organization {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  use_default_sla: boolean;
  notify_on_opened: boolean;
  notify_on_resolved: boolean;
  notify_on_assigned: boolean;
  notify_on_in_progress: boolean;
  user_count: number;
  project_count: number;
  ticket_count: number;
  has_custom_sla: boolean;
  sla_type: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationDetails extends Organization {
  notification_preferences: {
    notify_on_opened: boolean;
    notify_on_resolved: boolean;
    notify_on_assigned: boolean;
    notify_on_in_progress: boolean;
  };
  sla: {
    type: string;
    urgent_response_minutes?: number;
    high_response_minutes?: number;
    medium_response_minutes?: number;
    low_response_minutes?: number;
  };
  users: string[];
  projects: string[];
  tickets: string[];
}

export interface Project {
  id: number;
  name: string;
  code: string;
  organization: number;
  description: string;
  project_admin: number | null;
  created_at: string;
  updated_at: string;
}

interface OrganizationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: OrganizationDetails | null;
  projects: Project[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

// Initial state
const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  projects: [],
  loading: false,
  error: null,
  totalCount: 0,
};

// Async thunks
export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchOrganizations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<OrganizationsResponse>("/organizations/");
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch organizations"
      );
    }
  }
);

export const fetchOrganizationDetails = createAsyncThunk(
  "organizations/fetchOrganizationDetails",
  async (orgId: number, { rejectWithValue }) => {
    try {
      const response = await api.get<OrganizationDetails>(
        `/organizations/${orgId}/details/`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch organization details"
      );
    }
  }
);

export const createOrganization = createAsyncThunk(
  "organizations/createOrganization",
  async (
    orgData: {
      name: string;
      code: string;
      is_active: boolean;
      notify_on_opened: boolean;
      notify_on_assigned: boolean;
      notify_on_in_progress: boolean;
      notify_on_resolved: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/organizations/", orgData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to create organization"
      );
    }
  }
);

export const updateOrganization = createAsyncThunk(
  "organizations/updateOrganization",
  async (
    {
      orgId,
      orgData,
    }: {
      orgId: number;
      orgData: { name: string; code: string; status: boolean };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/organizations/${orgId}/`, {
        name: orgData.name,
        code: orgData.code,
        is_active: orgData.status,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to update organization"
      );
    }
  }
);

export const toggleOrganizationStatus = createAsyncThunk(
  "organizations/toggleOrganizationStatus",
  async (
    { orgId, isActive }: { orgId: number; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = isActive
        ? `/organizations/${orgId}/deactivate/`
        : `/organizations/${orgId}/activate/`;
      await api.post(endpoint);
      return { orgId, isActive: !isActive };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to toggle organization status"
      );
    }
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  "organizations/updateNotificationPreferences",
  async (
    {
      orgId,
      preferences,
    }: {
      orgId: number;
      preferences: {
        notify_on_opened: boolean;
        notify_on_resolved: boolean;
        notify_on_assigned: boolean;
        notify_on_in_progress: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/organizations/${orgId}/notification-preferences/`,
        preferences
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to update notification preferences"
      );
    }
  }
);

export const setCustomSLA = createAsyncThunk(
  "organizations/setCustomSLA",
  async (
    {
      orgId,
      slaData,
    }: {
      orgId: number;
      slaData: {
        urgent: number;
        high: number;
        medium: number;
        low: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/organizations/${orgId}/set-custom-sla/`, {
        urgent_response_minutes: slaData.urgent,
        high_response_minutes: slaData.high,
        medium_response_minutes: slaData.medium,
        low_response_minutes: slaData.low,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to set custom SLA"
      );
    }
  }
);

export const setDefaultSLA = createAsyncThunk(
  "organizations/setDefaultSLA",
  async (orgId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organizations/${orgId}/set-default-sla/`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to set default SLA"
      );
    }
  }
);

export const unassignSLA = createAsyncThunk(
  "organizations/unassignSLA",
  async (orgId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/organizations/${orgId}/unassign-sla/`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to unassign SLA"
      );
    }
  }
);

// Project thunks
export const createProject = createAsyncThunk(
  "organizations/createProject",
  async (
    projectData: {
      name: string;
      code: string;
      organization: number;
      description: string;
      project_admin: number | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/projects/", projectData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to create project"
      );
    }
  }
);

export const assignProjectAdmin = createAsyncThunk(
  "organizations/assignProjectAdmin",
  async (
    { projectId, adminId }: { projectId: number; adminId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/projects/${projectId}/assign_admin/`, {
        admin_id: adminId,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to assign admin"
      );
    }
  }
);

export const updateProjectAdmin = createAsyncThunk(
  "organizations/updateProjectAdmin",
  async (
    { projectId, adminId }: { projectId: number; adminId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/projects/${projectId}/update-admin/`, {
        admin_id: adminId,
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(
        err.response?.data?.detail || "Failed to update admin"
      );
    }
  }
);

// Slice
const organizationSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrganization: (state) => {
      state.currentOrganization = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Organizations
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload.results;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Organization Details
    builder
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrganization = action.payload;
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Organization
    builder
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.push(action.payload);
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Organization
    builder
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.organizations.findIndex(
          (org) => org.id === action.payload.id
        );
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?.id === action.payload.id) {
          state.currentOrganization = {
            ...state.currentOrganization,
            ...action.payload,
          };
        }
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle Organization Status
    builder
      .addCase(toggleOrganizationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleOrganizationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const org = state.organizations.find(
          (o) => o.id === action.payload.orgId
        );
        if (org) {
          org.is_active = action.payload.isActive;
        }
        if (state.currentOrganization?.id === action.payload.orgId) {
          state.currentOrganization.is_active = action.payload.isActive;
        }
      })
      .addCase(toggleOrganizationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Notification Preferences
    builder
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          state.currentOrganization.notification_preferences = action.payload;
        }
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Set Custom SLA
    builder
      .addCase(setCustomSLA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCustomSLA.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          state.currentOrganization.sla = action.payload.sla;
          state.currentOrganization.sla_type = action.payload.sla_type;
        }
      })
      .addCase(setCustomSLA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Set Default SLA
    builder
      .addCase(setDefaultSLA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultSLA.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          state.currentOrganization.sla_type = action.payload.sla_type;
        }
      })
      .addCase(setDefaultSLA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Unassign SLA
    builder
      .addCase(unassignSLA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unassignSLA.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrganization) {
          state.currentOrganization.sla_type = action.payload.sla_type;
        }
      })
      .addCase(unassignSLA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
