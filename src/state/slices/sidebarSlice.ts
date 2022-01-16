import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sidebarItems } from '../../components/sidebar-items/index';
import { AppThunk } from "../store";

type SidebarPosition = 'left' | 'right';
export interface ViewState {
    isLeftSidebarActive: boolean
    isRightSidebarActive: boolean
    leftSidebarView: string
    rightSidebarView: string
}

const initialState = {
    isLeftSidebarActive: false,
    isRightSidebarActive: false,
    leftSidebarView: '',
    rightSidebarView: ''
}

export const sidebarSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        toggleSidebar: (state, action: PayloadAction<SidebarPosition>) => {
            if (action.payload==='left')
                    state.isLeftSidebarActive = !state.isLeftSidebarActive;
            else
                state.isRightSidebarActive = !state.isRightSidebarActive;
        },
        setSidebarView: (state, action: PayloadAction<string>) => {
            const item = sidebarItems[action.payload];
            if (item.position==='left')
                state.leftSidebarView = action.payload;
            else
                state.rightSidebarView = action.payload;
        }
    }
});

export const { toggleSidebar, setSidebarView } = sidebarSlice.actions;

export const sidebarItemClicked = (name: string): AppThunk => (dispatch, getState) => {
    const item = sidebarItems[name];
    if (item.effect) item.effect();
    if (!item.view) return;

    dispatch(toggleSidebar(item.position));
    dispatch(setSidebarView(name));
};

export default sidebarSlice.reducer;