import React from 'react';
import './App.css';
import { useAppDispatch } from './app/hooks';
import MainView from './features/components/MainView';
import MenuBar from './features/components/MenuBar';
import MediaPlayer from './features/player/MediaPlayer';
import Sidebar from './features/sidebar/Sidebar';
import { sidebarClicked } from './features/sidebar/sidebarSlice';
import { leftSidebarViews, rightSidebarViews } from './features/sidebar/views';

function App() {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="App">
          <MenuBar />
          <Sidebar 
            id="left-sidebar"
            views={leftSidebarViews} 
            style="icons" 
            onClick={(viewId) => dispatch(sidebarClicked(viewId, 'left'))} 
          />
          <MainView />
          <Sidebar 
            id="right-sidebar"
            views={rightSidebarViews} 
            style="text-right" 
            onClick={(viewId) => dispatch(sidebarClicked(viewId, 'right'))} 
          />
          <MediaPlayer />
      </div>
    </>
  );
}

export default App;
