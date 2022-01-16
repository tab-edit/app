import Splitter from '@devbookhq/splitter';
import React from 'react';
import { useAppSelector } from '../state/hooks';
import './main-view.css';
import { sidebarItems } from './sidebar-items/index';
import Editor from './Editor';

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

export default MainView;