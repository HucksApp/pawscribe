import { createSlice } from '@reduxjs/toolkit';
import Cache from './cache';

const fileSlice = createSlice({
  name: 'files',
  initialState: null, // Changed from [] to null
  reducers: {
    setFiles(state, action) {
      Cache.setWithExpiry('files', action.payload, 10800000);
      return action.payload;
    },
    addFile(state, action) {
      const newState = state ? [...state, action.payload] : [action.payload];
      Cache.setWithExpiry('files', newState, 10800000);
      return newState;
    },
    removeFile(state, action) {
      const newState = state
        ? state.filter(file => file.id !== action.payload)
        : [];
      Cache.setWithExpiry('files', newState, 10800000);
      return newState;
    },
    updateFile(state, action) {
      const index = state
        ? state.findIndex(file => file.id === action.payload.id)
        : -1;
      if (index !== -1) {
        state[index] = action.payload;
        Cache.setWithExpiry('files', state, 10800000);
      }
      return state;
    },
    loadFilesFromCache() {
      const cachedFiles = Cache.getWithExpiry('files');
      return cachedFiles ? cachedFiles : null; // Return null if cache is empty
    },
  },
});

export const { setFiles, addFile, removeFile, updateFile, loadFilesFromCache } =
  fileSlice.actions;
export default fileSlice.reducer;
