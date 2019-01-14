import React, { Component } from 'react';
import { MapResultView } from './components/MapResultView';
import './App.css';
import sampleData, { sampleTwo } from './sampleData';

interface MarkerInterface {
  lat: number;
  lng: number;
  id: number;
  picture_url: string;
  space_type: string;
  bed_label: string;
  name: string;
  price: Price;
  map: { activeMarkupId: number; setActiveMarkupId: (id: number) => void };
  isActive: boolean;
  isSelected: boolean;
  getMarkerProps: {
    onClick: () => void;
  };
}

export interface Price {
  amount: number;
  amount_formatted: string;
  currency: string;
  is_micros_accuracy: boolean;
}

class Marker extends React.Component<MarkerInterface> {
  state = {
    show: false,
  };
  render() {
    const { isActive, isSelected, getMarkerProps } = this.props;
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
          backgroundColor: isActive ? 'black' : 'white',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '3px 5px',
          zIndex: isActive ? 2 : 1,
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
          cursor: 'pointer',
          color: isActive ? 'white' : isSelected ? 'grey' : 'black',
        }}
        {...getMarkerProps}
      >
        {isActive && <div>{this.props.name}</div>}
        {this.props.price.amount_formatted + ' ' + this.props.price.currency}
      </div>
    );
  }
}

class App extends Component {
  state = {
    data: sampleData,
  };
  render() {
    return (
      <>
        <div className="App">
          <MapResultView
            GoogleAPIMapKey={process.env.REACT_APP_GOOGLE_MAP_API || ''}
            // @ts-ignore
            MarkerComponent={Marker}
            data={this.state.data}
          />
        </div>
        <button
          onClick={() => {
            this.setState({ data: { ...sampleData } });
          }}
        >
          Thailand
        </button>
        <button
          onClick={() => {
            this.setState({ data: { ...sampleTwo } });
          }}
        >
          New Zealand
        </button>
      </>
    );
  }
}

export default App;
