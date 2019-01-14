import React, { Component } from 'react';
import { MapResultView } from './components/MapResultView';
import './App.css';
import sampleData, { sampleTwo } from './sampleData';
import customMapStyle from './mapStyle';

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
  getMarkerProps: (
    props: React.HTMLAttributes<HTMLElement>,
  ) => React.HTMLAttributes<HTMLElement>;
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
        {...getMarkerProps({
          onClick: () => {
            console.log(this.props);
          },
        })}
      >
        {this.props.price.amount_formatted + ' ' + this.props.price.currency}
      </div>
    );
  }
}

class MarkerWithPopup extends React.Component<MarkerInterface> {
  state = {
    show: false,
  };
  render() {
    const { isActive, isSelected, getMarkerProps } = this.props;
    return (
      <div
        {...getMarkerProps({
          onClick: () => {
            console.log(this.props);
          },
        })}
        style={{ position: 'relative' }}
      >
        {isActive ? (
          <div
            style={{
              transform: 'translate(-50%, -100%)',
              position: 'absolute',
              marginTop: '10px',
              backgroundColor: 'white',
              width: '270px',
              boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                paddingBottom: '56.66%',
                backgroundSize: 'cover',
                backgroundColor: '#fafafa',
                backgroundImage: `url(${this.props.picture_url})`,
              }}
            />
            <div style={{ padding: '10px' }}>
              <h6
                style={{
                  color: '#008489',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  margin: 0,
                }}
              >
                {this.props.space_type}
              </h6>
              <h5
                style={{
                  fontSize: '14px',
                  margin: '4px 0 6px 0',
                  lineHeight: '1.2em',
                }}
              >
                {this.props.name}
              </h5>
              <div style={{ fontSize: '14px' }}>
                <b>{this.props.bed_label}</b> -{' '}
                <b>
                  {this.props.price.amount + ' ' + this.props.price.currency}
                </b>
                /night
              </div>
            </div>
          </div>
        ) : (
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
          >
            {this.props.price.amount_formatted +
              ' ' +
              this.props.price.currency}
          </div>
        )}
        <div
          style={{
            width: isActive ? '12px' : '10px',
            height: isActive ? '12px' : '10px',
            backgroundColor: 'white',
            transform: 'rotate(45deg)',
            position: 'absolute',
            zIndex: 2,
            bottom: isActive ? '-13px' : '-4px',
            right: '50%',
            marginRight: isActive ? '-6px' : '-5px',
          }}
        />
        <div
          style={{
            width: isActive ? '12px' : '10px',
            height: isActive ? '12px' : '10px',
            backgroundColor: 'white',
            transform: 'rotate(45deg)',
            position: 'absolute',
            zIndex: -1,
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
            bottom: isActive ? '-13px' : '-4px',
            right: '50%',
            marginRight: isActive ? '-6px' : '-5px',
          }}
        />
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
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
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
        </div>

        <div style={{ marginTop: '50px', padding: '20px' }}>
          <MapResultView
            GoogleAPIMapKey={process.env.REACT_APP_GOOGLE_MAP_API || ''}
            // @ts-ignore
            MarkerComponent={MarkerWithPopup}
            data={this.state.data}
          />
        </div>

        <div style={{ marginTop: '50px', padding: '20px' }}>
          <MapResultView
            options={{ styles: customMapStyle, zoomControl: false }}
            GoogleAPIMapKey={process.env.REACT_APP_GOOGLE_MAP_API || ''}
            // @ts-ignore
            MarkerComponent={Marker}
            data={this.state.data}
          />
        </div>
      </>
    );
  }
}

export default App;
