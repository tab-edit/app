import { useAppSelector } from "../../app/hooks";
import Splitter from '@devbookhq/splitter';
import { leftSidebarViews, rightSidebarViews } from "../sidebar/views";
import Editor from "../editor/Editor";
import './MainView.css';

function MainView(props:any) {
    const sidebarState = useAppSelector(state => state.sidebar);

    return (
        <div id="main-view">
            <Splitter
                gutterClassName="split-view-gutter"
                draggerClassName="split-view-dragger"
            >
                { sidebarState.leftActive && leftSidebarViews[sidebarState.leftView]?.view }
                <Editor />
                { sidebarState.rightActive && rightSidebarViews[sidebarState.rightView]?.view }
            </Splitter>
        </div>
    )
}

export default MainView;