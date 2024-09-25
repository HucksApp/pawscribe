import { createSlice } from '@reduxjs/toolkit';
import Cache from './cache';

const folderSlice = createSlice({
  name: 'folders',
  initialState: null, // Initially set to null to indicate "not loaded"
  reducers: {
    setFolders(state, action) {
      Cache.setWithExpiry('folders', action.payload, 10800000); // Cache the payload with expiration
      return action.payload;
    },
    addFolder(state, action) {
      const newState = state ? [...state, action.payload] : [action.payload]; // Handle null state case
      Cache.setWithExpiry('folders', newState, 10800000);
      return newState;
    },
    removeFolder(state, action) {
      const newState = state
        ? state.filter(folder => folder.id !== action.payload)
        : [];
      Cache.setWithExpiry('folders', newState, 10800000);
      return newState;
    },
    updateFolder(state, action) {
      const index = state
        ? state.findIndex(folder => folder.id === action.payload.id)
        : -1;
      if (index !== -1) {
        state[index] = action.payload;
        Cache.setWithExpiry('folders', state, 10800000);
      }
      return state;
    },
    loadFoldersFromCache() {
      const cachedFolders = Cache.getWithExpiry('folders');
      return cachedFolders ? cachedFolders : null; // Return null if there's no cached data
    },
  },
});

export const {
  setFolders,
  addFolder,
  removeFolder,
  updateFolder,
  loadFoldersFromCache,
} = folderSlice.actions;
export default folderSlice.reducer;
