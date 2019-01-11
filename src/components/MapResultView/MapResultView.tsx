import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';

export interface MapResultViewProps {
  GoogleAPIMapKey: string;
  data: {
    lat: number;
    lng: number;
    markers: {
      lat: number;
      lng: number;
      [K: string]: any;
    }[];
  };
}

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

let map: any;
const initMap = function(
  position: { lat: number; lng: number },
  markers: { [K: string]: any }[],
) {
  // @ts-ignore
  map = new google.maps.Map(document.getElementById('map'), {
    center: { ...position },
    zoom: 16,
    // styles: mapStyle,
  });

  // Create Marker
  function HTMLMarker(data: { lat: number; lng: number; [K: string]: any }) {
    const { lat, lng, ...rest } = data;
    // @ts-ignore
    this.lat = lat;
    // @ts-ignore
    this.lng = lng;
    // @ts-ignore
    this.pos = new google.maps.LatLng(this.lat, this.lng);
    // @ts-ignore
    this.data = rest;
  }

  // @ts-ignore
  HTMLMarker.prototype = new google.maps.OverlayView();
  HTMLMarker.prototype.onRemove = function() {
    console.log('remove');
  };

  // init your html element here
  HTMLMarker.prototype.onAdd = function() {
    console.log('add');
    this.div = document.createElement('div');
    this.div.className = 'my-marker';
    ReactDOM.render(
      //@ts-ignore
      <Marker {...this.data} />,
      this.div,
    );
    // let span = document.createElement('span');
    // span.innerHTML = this.data.name;
    // this.div.appendChild(span);
    var panes = this.getPanes();
    panes.overlayImage.appendChild(this.div);
  };

  HTMLMarker.prototype.draw = function() {
    console.log('drag fire!');
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);
    // var panes = this.getPanes();
    this.div.style.left = position.x + 'px';
    this.div.style.top = position.y + 'px';
  };
  //@ts-ignore
  markers.forEach(marker => {
    console.log(marker);
    //@ts-ignore
    var htmlMarker = new HTMLMarker(marker);
    htmlMarker.setMap(map);

    //@ts-ignore
    // new google.maps.Marker({
    //   //@ts-ignore
    //   position: new google.maps.LatLng(marker.lat, marker.lng),
    //   map: map,
    // });
  });
};

export class MapResultView extends React.Component<MapResultViewProps> {
  target = React.createRef<HTMLDivElement>();
  s: HTMLScriptElement | undefined;

  componentDidMount() {
    const position = { lat: this.props.data.lat, lng: this.props.data.lng };
    if (!map) {
      this.s = document.createElement('script');
      // @ts-ignore
      this.id = 'google-map';
      this.s.async = true;
      this.s.defer = true;
      this.s.src = `https://maps.googleapis.com/maps/api/js?key=${
        this.props.GoogleAPIMapKey
      }`;

      document.body.appendChild(this.s);
      // @ts-ignore
      this.s.onload = () => {
        initMap(position, this.props.data.markers);
      };
    } else {
      initMap(position, this.props.data.markers);
    }
  }

  render() {
    return <div id="map" ref={this.target} style={{ height: '1000px' }} />;
  }
}
