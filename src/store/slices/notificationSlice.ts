import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type {
  Notification,
  NotificationsResponse,
  MarkAsReadResponse,
  UnreadCountResponse,
  MarkAllAsReadResponse,
} from '../../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  count: number;
  next: string | null;
  previous: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
};

// Fetch all notifications
export const fetchNotifications = createAsyncThunk<
  NotificationsResponse,
  void,
  { rejectValue: string }
>(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('notifications/');
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to fetch notifications';
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

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk<
  UnreadCountResponse,
  void,
  { rejectValue: string }
>(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('notifications/unread_count/');
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to fetch unread count';
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

// Mark single notification as read
export const markAsRead = createAsyncThunk<
  MarkAsReadResponse,
  number,
  { rejectValue: string }
>(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.post(`notifications/${notificationId}/mark_as_read/`);
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to mark notification as read';
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

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk<
  MarkAllAsReadResponse,
  void,
  { rejectValue: string }
>(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('notifications/mark_all_as_read/');
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to mark all notifications as read';
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

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.count = 0;
      state.next = null;
      state.previous = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload.results;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch notifications';
    });

    // Fetch Unread Count
    builder.addCase(fetchUnreadCount.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload.unread_count;
    });
    builder.addCase(fetchUnreadCount.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch unread count';
    });

    // Mark as Read
    builder.addCase(markAsRead.pending, (state) => {
      state.error = null;
    });
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      // Update the notification in the list
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload.notification.id
      );
      if (index !== -1) {
        state.notifications[index] = action.payload.notification;
      }
      // Decrease unread count
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    });
    builder.addCase(markAsRead.rejected, (state, action) => {
      state.error = action.payload || 'Failed to mark notification as read';
    });

    // Mark All as Read
    builder.addCase(markAllAsRead.pending, (state) => {
      state.error = null;
    });
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      // Mark all notifications as read
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        is_read: true,
      }));
      state.unreadCount = 0;
    });
    builder.addCase(markAllAsRead.rejected, (state, action) => {
      state.error = action.payload || 'Failed to mark all notifications as read';
    });
  },
});

export const { clearNotificationError, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
