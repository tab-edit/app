import React from 'react';
import Editor from './components/Editor';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='app'>
        <Editor />
      </div>
    )
  }
}
export default App;
