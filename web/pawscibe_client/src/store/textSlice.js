import { createSlice } from '@reduxjs/toolkit';
import { getWithExpiry, setWithExpiry } from './cache';

const textSlice = createSlice({
  name: 'texts',
  initialState: [],
  reducers: {
    setTexts(state, action) {
      setWithExpiry('texts', action.payload, 10800000); // 1 day TTL
      return action.payload;
    },
    addText(state, action) {
      const newState = [...state, action.payload];
      setWithExpiry('texts', newState, 10800000);
      return newState;
    },
    removeText(state, action) {
      const newState = state.filter(text => text.id !== action.payload);
      setWithExpiry('texts', newState, 10800000);
      return newState;
    },
    updateText(state, action) {
      const index = state.findIndex(text => text.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
        setWithExpiry('texts', state, 10800000);
      }
      return state;
    },
    loadTextsFromCache(state) {
      const cachedtexts = getWithExpiry('texts');
      return cachedtexts ? cachedtexts : state;
    },
  },
});

export const { setTexts, addText, removeText, updateText, loadTextsFromCache } =
  textSlice.actions;
export default textSlice.reducer;
