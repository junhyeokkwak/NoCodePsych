import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import accountReducer from "./slices/accountSlice.js";
import cacheReducer from "./slices/cacheSlice.js";

const persistConfig = {
  key: "root",
  // save to localStorage
  storage,
  whitelist: ["account"],
};

const rootReducer = combineReducers({
  account: accountReducer,
  cache: cacheReducer,
});

export default persistReducer(persistConfig, rootReducer);
