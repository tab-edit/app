import { MyLocation } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Slider } from '@mui/material';
import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { resolveMediaSeeking, setSliderPosition, togglePlayState, toggleSelector } from '../state/slices/mediaPlayerSlice';
import './media-player.css';

function handleSeekMeasure() {
    //update measure location, then update slider location
}

function MediaPlayer(props:any) {
    const state = useAppSelector((state) => state.mediaPlayer);
    const dispatch = useAppDispatch();
    const [sliderVal, setSliderVal] = useState(state.sliderPosition);
    return (
        <div id="media-player">
            <IconButton onClick={() => dispatch(togglePlayState())} >
                { state.status==='playing' ? <PauseIcon color="primary"/> : <PlayIcon color="primary"/> }
            </IconButton>

            <Slider
                value={sliderVal}
                onChange={(_, newVal) => {
                    dispatch(setSliderPosition(newVal as number));
                    setSliderVal(newVal as number);
                }}
                onChangeCommitted={() => dispatch(resolveMediaSeeking())}
            />

            <IconButton 
                aria-label='seek-measure-bttn'
                onClick={handleSeekMeasure}
            >
                <MyLocation color='primary' />
            </IconButton>

            <IconButton onClick={() => {dispatch(toggleSelector())}} >
                <TouchAppIcon color={ (state.isSelectorActive ? "secondary" : "primary") as any }/>
            </IconButton>
        </div>
    )
}

export default MediaPlayer;