import { createSlice } from '@reduxjs/toolkit';
import Cache from './cache';

const textSlice = createSlice({
  name: 'texts',
  initialState: null, // Changed from an empty array to null for better state handling
  reducers: {
    setTexts(state, action) {
      Cache.setWithExpiry('texts', action.payload, 10800000); // Cache the texts
      return action.payload;
    },
    addText(state, action) {
      const newState = state ? [...state, action.payload] : [action.payload]; // Handle case when state is null
      Cache.setWithExpiry('texts', newState, 10800000);
      return newState;
    },
    removeText(state, action) {
      const newState = state
        ? state.filter(text => text.id !== action.payload)
        : [];
      Cache.setWithExpiry('texts', newState, 10800000);
      return newState;
    },
    updateText(state, action) {
      const index = state
        ? state.findIndex(text => text.id === action.payload.id)
        : -1;
      if (index !== -1) {
        state[index] = action.payload;
        Cache.setWithExpiry('texts', state, 10800000);
      }
      return state;
    },
    loadTextsFromCache() {
      const cachedtexts = Cache.getWithExpiry('texts');
      return cachedtexts ? cachedtexts : null; // Return null if there's no cached data
    },
  },
});

export const { setTexts, addText, removeText, updateText, loadTextsFromCache } =
  textSlice.actions;
export default textSlice.reducer;
