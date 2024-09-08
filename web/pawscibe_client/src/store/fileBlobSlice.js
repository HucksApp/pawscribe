import { createSlice } from '@reduxjs/toolkit';
import Cache from './cache';

const fileBlobSlice = createSlice({
  name: 'fileBlobs',
  initialState: [],
  reducers: {
    setFileBlobs(state, action) {
      Cache.setWithExpiry('fileBlobs', action.payload, 10800000);
      return action.payload;
    },
    addFileBlob(state, action) {
      const fileBlobExists = state.find(blob => blob.id === action.payload.id);
      if (!fileBlobExists) {
        const newState = [...state, action.payload];
        Cache.setWithExpiry('fileBlobs', newState, 10800000);
        return newState;
      }
      fileBlobExists.blob = action.payload.blob;
      return state; // If blob already exists, return the current state
    },
    removeFileBlob(state, action) {
      const newState = state.filter(blob => blob.id !== action.payload);
      Cache.setWithExpiry('fileBlobs', newState, 10800000);
      return newState;
    },
    updateFileBlob(state, action) {
      const index = state.findIndex(blob => blob.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        Cache.setWithExpiry('fileBlobs', state, 10800000);
      }
      return state;
    },
    loadFileBlobsFromCache(state) {
      const cachedBlobs = Cache.getWithExpiry('fileBlobs');
      return cachedBlobs ? cachedBlobs : state;
    },
  },
});

// Selector to get a single file blob by its id
export const selectFileBlobById = (state, id) =>
  state.fileBlobs.find(blob => blob.id === id);

export const {
  setFileBlobs,
  addFileBlob,
  removeFileBlob,
  updateFileBlob,
  loadFileBlobsFromCache,
} = fileBlobSlice.actions;
export default fileBlobSlice.reducer;
