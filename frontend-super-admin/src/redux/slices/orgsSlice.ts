import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { OrgsState, Organization } from '../../types';

const initialState: OrgsState = {
  organizations: [],
  loading: false,
  error: null,
};

/** Async thunk: fetch all organizations */
export const fetchOrgs = createAsyncThunk<Organization[], void, { rejectValue: string }>(
  'orgs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Organization[]>('/orgs');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch organizations.';
      return rejectWithValue(message);
    }
  }
);

/** Async thunk: create a new organization */
export const createOrg = createAsyncThunk<Organization, string, { rejectValue: string }>(
  'orgs/create',
  async (name, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Organization>('/orgs', { name });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create organization.';
      return rejectWithValue(message);
    }
  }
);

/** Async thunk: update an organization */
export const updateOrg = createAsyncThunk<Organization, { id: string; name: string }, { rejectValue: string }>(
  'orgs/update',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<Organization>(`/orgs/${id}`, { name });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update organization.';
      return rejectWithValue(message);
    }
  }
);

const orgsSlice = createSlice({
  name: 'orgs',
  initialState,
  reducers: {
    clearOrgsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orgs
      .addCase(fetchOrgs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrgs.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrgs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch organizations.';
      })
      // Create org
      .addCase(createOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.unshift(action.payload);
      })
      .addCase(createOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create organization.';
      })
      // Update org
      .addCase(updateOrg.fulfilled, (state, action) => {
        const index = state.organizations.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
      })
      .addCase(updateOrg.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update organization.';
      });
  },
});

export const { clearOrgsError } = orgsSlice.actions;
export default orgsSlice.reducer;
