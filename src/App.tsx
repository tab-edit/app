import React from 'react';
import './App.css';
import MainView from './components/MainView';
import MediaPlayer from './components/MediaPlayer';
import MenuBar from './components/MenuBar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <>
      <div className="App">
          <MenuBar />
          <Sidebar position='left' className='sb-left'/>
          <MainView />
          <Sidebar position='right' className='sb-right'/>
          <MediaPlayer />
      </div>
    </>
  );
}

export default App;
