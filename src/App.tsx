import React, { Component } from 'react';
import { MapResultView } from './components/MapResultView';
import './App.css';
import sampleData from './sampleData';

interface MarkerInterface {
  lat: number;
  lng: number;
  id: number;
  picture_url: string;
  space_type: string;
  bed_label: string;
  name: string;
  price: Price;
}

export interface Price {
  amount: number;
  amount_formatted: string;
  currency: string;
  is_micros_accuracy: boolean;
}

class Marker extends React.Component<MarkerInterface> {
  render() {
    return (
      <div
        style={{
          paddingLeft: '6px',
          paddingRight: '5px',
          position: 'relative',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(0, 0, 0, 0.2)',
          borderImage: 'initial',
          borderRadius: '2px',
          backgroundColor: 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '3px 5px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
          cursor: 'pointer',
        }}
        onClick={() => {
          console.log(this.props);
        }}
      >
        {this.props.price.amount_formatted + ' ' + this.props.price.currency}
      </div>
    );
  }
}

class App extends Component {
  render() {
    console.log(sampleData);
    return (
      <div className="App">
        <MapResultView
          GoogleAPIMapKey={process.env.REACT_APP_GOOGLE_MAP_API || ''}
          // @ts-ignore
          MarkerComponent={Marker}
          data={sampleData}
        />
      </div>
    );
  }
}

export default App;
