import { createSlice } from "@reduxjs/toolkit";

export interface NavigationState {
  previousEndpoint?: string;
}

const navigationSlice = createSlice({
  name: "auth",
  initialState: {
    previousEndpoint: undefined
  } as NavigationState,
  reducers: {
    setPreviousEndpoint(state, action) {
      state.previousEndpoint = action.payload;
    }
  }
});

export const { setPreviousEndpoint } = navigationSlice.actions;

export const navigationReducer = navigationSlice.reducer;
