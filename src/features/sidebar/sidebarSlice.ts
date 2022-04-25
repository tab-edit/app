import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../../app/store";

export type SidebarPosition = 'left' | 'right';
export interface SidebarState {
    leftActive: boolean,
    rightActive: boolean,
    leftView: string,
    rightView: string
}

const initialState = {
    leftActive: false,
    rightActive: false,
    leftView: '',
    rightView: ''
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleLeft: (state:SidebarState) => {
            state.leftActive = !state.leftActive;
        },
        toggleRight: (state:SidebarState) => {
            state.rightActive = !state.rightActive;
        },
        setLeftView: (state:SidebarState, action: PayloadAction<string>) => {
            state.leftView = action.payload;
        },
        setRightView: (state:SidebarState, action: PayloadAction<string>) => {
            state.rightView = action.payload;
        }
    }
})

export const { toggleLeft, toggleRight, setLeftView, setRightView } = sidebarSlice.actions;

export const sidebarClicked = function(viewId: string, position: SidebarPosition): AppThunk {
    return (dispatch, getState) => {
        let sidebarState = getState().sidebar;
        if (position==='left') {
            if (sidebarState.leftView!==viewId) dispatch(setLeftView(viewId));
            if (!sidebarState.leftActive || sidebarState.leftView===viewId) dispatch(toggleLeft());
        }else {
            if (sidebarState.rightView!==viewId) dispatch(setRightView(viewId));
            if (!sidebarState.rightActive || sidebarState.rightView===viewId) dispatch(toggleRight());
        }
    }
}

export default sidebarSlice.reducer;