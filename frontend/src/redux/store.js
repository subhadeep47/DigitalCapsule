import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlicer';
import capsulesSlicer from './capsulesSlicer';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    capsules: capsulesSlicer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export default store
