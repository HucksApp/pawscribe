import { createSlice } from '@reduxjs/toolkit';
import Cache from './cache';

const folderSlice = createSlice({
  name: 'folders',
  initialState: [],
  reducers: {
    setFolders(state, action) {
      Cache.setWithExpiry('folders', action.payload, 10800000);
      return action.payload;
    },
    addFolder(state, action) {
      const newState = [...state, action.payload];
      Cache.setWithExpiry('folders', newState, 10800000);
      return newState;
    },
    removeFolder(state, action) {
      const newState = state.filter(folder => folder.id !== action.payload);
      Cache.setWithExpiry('folders', newState, 10800000);
      return newState;
    },
    updateFolder(state, action) {
      const index = state.findIndex(folder => folder.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        Cache.setWithExpiry('folders', state, 10800000);
      }
      return state;
    },
    loadFoldersFromCache(state) {
      const cachedFolders = Cache.getWithExpiry('folders');
      return cachedFolders ? cachedFolders : state;
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
