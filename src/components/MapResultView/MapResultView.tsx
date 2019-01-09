import * as React from 'react';
import './style.css';

interface MapResultViewProps {
  GoogleAPIMapKey: string;
  basePosition: {
    lat: number;
    lng: number;
  };
}

let map: any;
const initMap = function(position: { lat: number; lng: number }) {
  // @ts-ignore
  map = new google.maps.Map(document.getElementById('map'), {
    center: { ...position },
    zoom: 15,
    // styles: mapStyle,
  });

  // Create Marker
  function HTMLMarker(lat: number, lng: number) {
    // @ts-ignore
    this.lat = lat;
    // @ts-ignore
    this.lng = lng;
    // @ts-ignore
    this.pos = new google.maps.LatLng(lat, lng);
  }

  // @ts-ignore
  HTMLMarker.prototype = new google.maps.OverlayView();
  HTMLMarker.prototype.onRemove = function() {
    console.log('remove');
  };

  // init your html element here
  HTMLMarker.prototype.onAdd = function() {
    console.log('add');
    var div = document.createElement('div');
    div.className = 'my-marker';
    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  };

  HTMLMarker.prototype.draw = function() {
    console.log('drag fire!');
    var overlayProjection = this.getProjection();
    var position = overlayProjection.fromLatLngToDivPixel(this.pos);
    var panes = this.getPanes();
    panes.overlayImage.style.left = position.x + 'px';
    panes.overlayImage.style.top = position.y + 'px';
  };
  //@ts-ignore
  var htmlMarker = new HTMLMarker(59.327, 18.067);
  htmlMarker.setMap(map);
};

export class MapResultView extends React.Component<MapResultViewProps> {
  target = React.createRef<HTMLDivElement>();
  s: HTMLScriptElement | undefined;

  componentDidMount() {
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
        initMap(this.props.basePosition);
      };
    } else {
      initMap(this.props.basePosition);
    }
  }

  render() {
    return <div id="map" ref={this.target} style={{ height: '1000px' }} />;
  }
}
