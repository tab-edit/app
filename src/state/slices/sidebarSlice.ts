import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        toggleSidebar: (state, action: PayloadAction<SidebarPosition>) => {
            if (action.payload==='left')
                    state.isLeftSidebarActive = !state.isLeftSidebarActive;
            else
                state.isRightSidebarActive = !state.isRightSidebarActive;
        },
        setSidebarView: (state, action: PayloadAction<{position:SidebarPosition, viewName: string}>) => {
            if (action.payload.position==='left')
                state.leftSidebarView = action.payload.viewName;
            else
                state.rightSidebarView = action.payload.viewName;
        }
    }
});

export const { toggleSidebar, setSidebarView } = viewSlice.actions;
export default viewSlice.reducer;