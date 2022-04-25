import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MediaPlayerState = {
    playing: boolean,
    position: number
}

const initialState = {
    playing: false,
    position: 0
}

const mediaPlayerSlice = createSlice({
    name: 'mediaPlayer',
    initialState,
    reducers: {
        togglePlayer(state:MediaPlayerState) {
            state.playing = !state.playing;
        },
        seek(state:MediaPlayerState, action:PayloadAction<number>) {
            state.position = action.payload;
        }
    }
});

export const { togglePlayer, seek } = mediaPlayerSlice.actions;

export default mediaPlayerSlice.reducer;