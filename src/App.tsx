import React from 'react';
import logo from './logo.svg';
import './App.css';
import MainView from './components/main-view/MainView';
import MediaPlayer from './components/MediaPlayer';
import MenuBar from './components/MenuBar';
import Sidebar from './components/sidebars/Sidebar';

function App() {
  return (
    <div className="App">
        <MenuBar />
        <div id="app-center">
          <Sidebar position='left' />
          <MainView />
          <Sidebar position='right' />
        </div>
        <MediaPlayer />
    </div>
  );
}

export default App;
