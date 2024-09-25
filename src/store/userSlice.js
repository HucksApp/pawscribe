// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cache from './cache';

const userSlice = createSlice({
  name: 'user',
  initialState: Cache.getWithExpiry('user') || null, // Load initial state from cache if available
  reducers: {
    setUser(state, action) {
      Cache.setWithExpiry('user', action.payload, 10800000); // 1 day TTL
      return action.payload;
    },
    clearUser() {
      Cache.clearAllWithPrefix('all');
      return null;
    },

    loadUserFromCache() {
      return Cache.getWithExpiry('user') || null;
    },
  },
});

export const { setUser, clearUser, loadUserFromCache } = userSlice.actions;
export default userSlice.reducer;
