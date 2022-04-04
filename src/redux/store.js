import persistedReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
  });
  store._persistor = persistStore(store);
  return store;
};

export const wrapper = createWrapper(makeStore);
