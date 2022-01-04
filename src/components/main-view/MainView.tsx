import React, { useState } from 'react';
import Split from 'react-split';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import Editor from './editor/Editor';
import '../../styles/main-view.css';
import { toggleSidebar } from '../../state/slices/sidebarSlice';
import Sidebar from '../sidebars/Sidebar';
import { sidebarItems } from '../sidebars/sidebar-items/index';
import Splitter, { SplitDirection } from '@devbookhq/splitter';

function MainView(props:any) {
    const viewState = useAppSelector((state) => state.view);
    
    const gutterClassName = "split-view-gutter";
    const draggerClassName = "split-view-dragger";

    return (
        <div id="main-view">
            <Splitter
                gutterClassName= {gutterClassName}
                draggerClassName= {draggerClassName}
            >
                { viewState.isLeftSidebarActive && sidebarItems[viewState.leftSidebarView]?.view }
                <Editor />
                { viewState.isRightSidebarActive && sidebarItems[viewState.rightSidebarView]?.view }
            </Splitter>
        </div>
    )
}

function getElementWidth(className:string) {
    const box:any = document.querySelector(`.${className.replace(/^\./g, '')}`)!
    return box.offsetWidth || 0;
}

export default MainView;