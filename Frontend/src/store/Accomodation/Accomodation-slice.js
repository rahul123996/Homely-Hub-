import { createSlice } from "@reduxjs/toolkit";

const accomodationSlice = createSlice({
  name: "accomodation",
  initialState: {
    accomodation: [],
    loading: false,
    error: null,
  },
  reducers: {
    getAccomodationRequest(state) {
      state.loading = true;
    },
    getAccomodation(state, action) {
      state.accomodation = action.payload;
      state.loading = false;
    },
    getErrors(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const accomodationActions = accomodationSlice.actions;

export default accomodationSlice;
