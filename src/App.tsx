import React, { Component } from 'react';
import { MapResultView } from './components/MapResultView';
import './App.css';
import sampleData from './sampleData';

class App extends Component {
  render() {
    console.log(sampleData);
    return (
      <div className="App">
        <MapResultView
          GoogleAPIMapKey={process.env.REACT_APP_GOOGLE_MAP_API || ''}
          data={sampleData}
        />
      </div>
    );
  }
}

export default App;
