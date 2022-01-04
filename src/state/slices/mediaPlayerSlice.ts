import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';

type MediaStatus = 'playing' | 'paused' | 'seeking' | 'disabled';

export interface MediaPlayerState {
    status: MediaStatus
    isSelectorActive: boolean
    sliderPosition: number
}

const initialState: MediaPlayerState = {
    status: 'paused',
    isSelectorActive: false,
    sliderPosition: 0,
}

export const mediaPlayerSlice = createSlice({
    name: 'media-player',
    initialState,
    reducers: {
        setMediaState: (state, action: PayloadAction<MediaStatus>) => {
            switch(action.payload) {
                case 'playing':
                case 'paused':
                case 'seeking':
                case 'disabled':
                    state.status = action.payload;
                    break;
            }
        },
        togglePlayState: (state) => {
            if (state.status==='playing') state.status = 'paused';
            else if (state.status==='paused') state.status = 'playing';
        },
        setSliderPosition: (state, action: PayloadAction<number>) => {
            state.status = 'seeking';
            state.sliderPosition = action.payload;
        },
        toggleSelector: (state) => {
            state.isSelectorActive = !state.isSelectorActive;
        }
    }
});

export const { setMediaState, togglePlayState, setSliderPosition, toggleSelector } = mediaPlayerSlice.actions;

export const resolveMediaSeeking = (): AppThunk => (
    dispatch, 
    getState
) => {
        dispatch(setMediaState('paused'))
        //call function to resolve the current note position that corresponds to the media slider position.
}

export default mediaPlayerSlice.reducer;