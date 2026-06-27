import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import flagsReducer from './slices/flagsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flags: flagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
