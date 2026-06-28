import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flagsReducer from './slices/flagsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flags: flagsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
