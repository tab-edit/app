import { LocationSearching, Pause, PlayArrow } from "@mui/icons-material";
import { IconButton, Slider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { seek, togglePlayer } from "./mediaPlayerSlice";
import './MediaPlayer.css';
import { useState } from "react";

function handleSeekMeasure() {
    //update measure location, then update slider location
}

function MediaPlayer(props:any) {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.player);
    const [sliderVal, setSliderVal] = useState(state.position);
    return (
        <div id="media-player">
            <IconButton onClick={() => dispatch(togglePlayer())} >
                { state.playing ? <Pause color="primary"/> : <PlayArrow color="primary"/> }
            </IconButton>

            <Slider
                value={sliderVal}
                onChange={(_, newVal) => setSliderVal(newVal as number)}
                onChangeCommitted={() => dispatch(seek(sliderVal))}
            />

            <IconButton 
                aria-label='seek-measure-bttn'
                onClick={handleSeekMeasure}
            >
                <LocationSearching color='primary' />
            </IconButton>
        </div>
    )
}

export default MediaPlayer;