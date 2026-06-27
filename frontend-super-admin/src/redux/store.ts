import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orgsReducer from './slices/orgsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orgs: orgsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
