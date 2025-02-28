import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

const rootReducer = combineReducers({
    user: userReducer,
});

export const makeStore = () => {
    const store = configureStore({
        reducer: rootReducer,
    });
    return store;

}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']