import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sidebarReducer from '../features/sidebar/sidebarSlice';
import mediaPlayerReducer from '../features/player/mediaPlayerSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    player: mediaPlayerReducer
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
