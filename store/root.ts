import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { AnyAction, combineReducers, EmptyObject } from "redux";
import logger from "redux-logger";
import { loadState, saveState } from "./localStorage";
import { navigationReducer, NavigationState } from "./navigationSlice";
import { userReducer, UserState } from "./userSlice";

const reducers = combineReducers({
  user: userReducer,
  navigation: navigationReducer
});

const middlewareConfig = {
  serializableCheck: false
};

const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV !== "production") {
      return getDefaultMiddleware(middlewareConfig).concat(logger);
    }
    return getDefaultMiddleware(middlewareConfig);
  }
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof reducers>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): ThunkDispatch<
  EmptyObject & {
    user: UserState;
    navigation: NavigationState;
  },
  undefined,
  AnyAction
> => useDispatch<AppDispatch>();

export { store };
