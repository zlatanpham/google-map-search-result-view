import React, { Component } from 'react';
import { MapResultView } from './components/MapResultView';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MapResultView
          GoogleAPIMapKey={process.env.REACT_APP_GOOGLE_MAP_API || ''}
          basePosition={{ lat: 59.327, lng: 18.067 }}
        />
      </div>
    );
  }
}

export default App;
