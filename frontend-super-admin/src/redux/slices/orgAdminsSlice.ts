import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import type { OrgAdminsState, OrgAdmin } from '../../types';

const initialState: OrgAdminsState = {
  admins: [],
  admin: null,
  loading: false,
  error: null,
};

export const fetchOrgAdmins = createAsyncThunk<OrgAdmin[], void, { rejectValue: string }>(
  'orgAdmins/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<OrgAdmin[]>('/orgs/admins');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch organization admins.';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrgAdmin = createAsyncThunk<OrgAdmin, string, { rejectValue: string }>(
  'orgAdmins/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<OrgAdmin>(`/orgs/admins/${id}`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch org admin.';
      return rejectWithValue(message);
    }
  }
);

const orgAdminsSlice = createSlice({
  name: 'orgAdmins',
  initialState,
  reducers: {
    clearOrgAdminsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrgAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchOrgAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch organization admins.';
      })
      .addCase(fetchOrgAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrgAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchOrgAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch org admin.';
      });
  },
});

export const { clearOrgAdminsError } = orgAdminsSlice.actions;
export default orgAdminsSlice.reducer;