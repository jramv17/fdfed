import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';
import sideDashReducer from './slice/SideDashSlice';

const persistConfig = {
    key: 'redux-storage',
    storage,
    timeout: 100
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    sideDash: sideDashReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register'],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
