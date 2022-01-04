import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import mediaPlayerReducer from './slices/mediaPlayerSlice';
import viewSlice from './slices/sidebarSlice';

export const store = configureStore({
    reducer: {
        mediaPlayer: mediaPlayerReducer,
        view: viewSlice
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
