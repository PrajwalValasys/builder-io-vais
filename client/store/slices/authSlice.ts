import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Types
interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  status: number;
  message: string;
  data?: User;
}

// API Configuration
const BACKEND_URL = import.meta.env.VITE_STAGING_BACKEND_URL || 'https://kq0nd3bt-6013.inc1.devtunnels.ms/';
const LOGIN_URL = `${BACKEND_URL}login/`;

const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Initial state
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(LOGIN_URL, credentials, apiConfig);
      
      if (response.data.status === 200) {
        if (response.data.data?.is_active) {
          toast.success(response.data.message, { autoClose: 4000 });
          return response.data;
        } else {
          const message = 'Account is not active contact Admin or Incomplete Email and Phone Verification';
          toast.error(message, { autoClose: 4000 });
          return rejectWithValue(message);
        }
      } else if (response.data.status === 401) {
        toast.error(response.data.message, { autoClose: 4000 });
        return rejectWithValue(response.data.message);
      }
      
      return rejectWithValue('Login failed');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message, { autoClose: 4000 });
      return rejectWithValue(message);
    }
  }
);

export const linkedinLogin = createAsyncThunk(
  'auth/linkedinLogin',
  async (code: string, { rejectWithValue }) => {
    try {
      const LINKEDIN_URL = `${BACKEND_URL}user-accounts/linkedin/`;
      const response = await axios.post(LINKEDIN_URL, { code }, apiConfig);
      
      if (response.data.status === 200) {
        toast.success('LinkedIn login successful', { autoClose: 4000 });
        return response.data;
      }
      
      return rejectWithValue('LinkedIn login failed');
    } catch (error: any) {
      const message = error.response?.data?.message || 'LinkedIn login failed';
      toast.error(message, { autoClose: 4000 });
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data || null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // LinkedIn login
      .addCase(linkedinLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(linkedinLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.data || null;
        state.error = null;
      })
      .addCase(linkedinLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
