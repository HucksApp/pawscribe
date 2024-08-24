// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getWithExpiry, setWithExpiry, clearAllWithPrefix } from './cache';

const userSlice = createSlice({
  name: 'user',
  initialState: getWithExpiry('user') || null, // Load initial state from cache if available
  reducers: {
    setUser(state, action) {
      setWithExpiry('user', action.payload, 10800000); // 1 day TTL
      return action.payload;
    },
    clearUser() {
      clearAllWithPrefix('all');
      return null;
    },

    loadUserFromCache() {
      return getWithExpiry('user') || null;
    },
  },
});

export const { setUser, clearUser, loadUserFromCache } = userSlice.actions;
export default userSlice.reducer;
