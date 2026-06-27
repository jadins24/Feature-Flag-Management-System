import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { FlagsState, FeatureFlag } from '../../types';

const initialState: FlagsState = {
  flags: [],
  loading: false,
  error: null,
};

/** Async thunk: fetch flags for the current org */
export const fetchFlags = createAsyncThunk<FeatureFlag[], void, { rejectValue: string }>(
  'flags/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<FeatureFlag[]>('/flags');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch flags.';
      return rejectWithValue(message);
    }
  }
);

/** Async thunk: create a new feature flag */
export const createFlag = createAsyncThunk<FeatureFlag, string, { rejectValue: string }>(
  'flags/create',
  async (featureKey, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<FeatureFlag>('/flags', { feature_key: featureKey });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create flag.';
      return rejectWithValue(message);
    }
  }
);

/** Async thunk: update a feature flag's feature key */
export const updateFlag = createAsyncThunk<FeatureFlag, { id: string; feature_key: string }, { rejectValue: string }>(
  'flags/update',
  async ({ id, feature_key }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<FeatureFlag>(`/flags/${id}`, { feature_key });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update flag.';
      return rejectWithValue(message);
    }
  }
);

/** Async thunk: toggle a feature flag's enabled state */
export const toggleFlag = createAsyncThunk<
  FeatureFlag,
  { id: string; enabled: boolean },
  { rejectValue: string }
>(
  'flags/toggle',
  async ({ id, enabled }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<FeatureFlag>(`/flags/${id}`, { enabled });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to toggle flag.';
      return rejectWithValue(message);
    }
  }
);

/** Async thunk: delete a feature flag */
export const deleteFlag = createAsyncThunk<string, string, { rejectValue: string }>(
  'flags/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/flags/${id}`);
      return id;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete flag.';
      return rejectWithValue(message);
    }
  }
);

const flagsSlice = createSlice({
  name: 'flags',
  initialState,
  reducers: {
    clearFlagsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch flags
      .addCase(fetchFlags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlags.fulfilled, (state, action) => {
        state.loading = false;
        state.flags = action.payload;
      })
      .addCase(fetchFlags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch flags.';
      })
      // Create flag
      .addCase(createFlag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlag.fulfilled, (state, action) => {
        state.loading = false;
        state.flags.unshift(action.payload);
      })
      .addCase(createFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create flag.';
      })
      // Update flag
      .addCase(updateFlag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.flags.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.flags[index] = action.payload;
        }
      })
      .addCase(updateFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update flag.';
      })
      // Toggle flag
      .addCase(toggleFlag.fulfilled, (state, action) => {
        const index = state.flags.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.flags[index] = action.payload;
        }
      })
      .addCase(toggleFlag.rejected, (state, action) => {
        state.error = action.payload || 'Failed to toggle flag.';
      })
      // Delete flag
      .addCase(deleteFlag.fulfilled, (state, action) => {
        state.flags = state.flags.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteFlag.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete flag.';
      });
  },
});

export const { clearFlagsError } = flagsSlice.actions;
export default flagsSlice.reducer;