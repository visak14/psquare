import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../api/authApi";

export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const data = await loginUser(userData);
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    return await registerUser(userData);
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, isAuthenticated: false, error: null },
    reducers: {
      loginSuccess: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      },
      logout: (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.isAuthenticated = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
          state.error = action.payload;
        });
    },
  });
  
  export const { logout, loginSuccess } = authSlice.actions;
  export default authSlice.reducer;
  
