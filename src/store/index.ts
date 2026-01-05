import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import passwordResetReducer from './slices/passwordResetSlice';
import notificationReducer from './slices/notificationSlice';
import ticketReducer from './slices/ticketSlice';
import userReducer from './slices/userSlice';
import organizationReducer from './slices/organizationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    passwordReset: passwordResetReducer,
    notifications: notificationReducer,
    tickets: ticketReducer,
    users: userReducer,
    organizations: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
