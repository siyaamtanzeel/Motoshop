import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

interface Bike {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller: string; // always admin
  specifications: Record<string, string | number | boolean>;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BikeState {
  bikes: Bike[];
  loading: boolean;
  error: string | null;
}

const initialState: BikeState = {
  bikes: [],
  loading: false,
  error: null,
};

export const fetchBikes = createAsyncThunk(
  "bikes/fetchBikes",
  async (
    params: { search?: string; category?: string; sortBy?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams: Record<string, string> = {};

      if (params.category) {
        queryParams.category = params.category;
      }

      // Handle sorting
      if (params.sortBy) {
        if (params.sortBy === "price") {
          queryParams.sortBy = "price";
          queryParams.sortOrder = "asc";
        } else if (params.sortBy === "-price") {
          queryParams.sortBy = "price";
          queryParams.sortOrder = "desc";
        }
      }

      const res = await api.get("/bikes", { params: queryParams });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bikes"
      );
    }
  }
);

const bikeSlice = createSlice({
  name: "bikes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBikes.fulfilled, (state, action) => {
        state.loading = false;
        state.bikes = action.payload;
      })
      .addCase(fetchBikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default bikeSlice.reducer;
export type { Bike };
