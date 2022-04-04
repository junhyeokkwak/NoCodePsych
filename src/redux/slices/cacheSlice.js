import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageBeforeRedirect: null,
};

const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    setPageBeforeRedirect(state, action) {
      const { page } = action.payload;
      state.pageBeforeRedirect = page;
    },
    clearAfterRedirect(state, action) {
      state.pageBeforeRedirect = null;
    },
  },
});

export const { setPageBeforeRedirect, clearAfterRedirect } = cacheSlice.actions;

export default cacheSlice.reducer;
