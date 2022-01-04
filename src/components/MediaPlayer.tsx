import React, {useState} from 'react';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import '../styles/media-player.css'
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayIcon from '@mui/icons-material/PlayArrow';
import { Slider, InputLabel, OutlinedInput, InputAdornment, Button } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { resolveMediaSeeking, setSliderPosition, togglePlayState, toggleSelector } from '../state/slices/mediaPlayerSlice';

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
                { state.status==='playing' ? <PlayIcon color="primary"/> : <PauseIcon color="primary"/> }
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