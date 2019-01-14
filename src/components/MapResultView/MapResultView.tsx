import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './style.css';

export interface MapResultViewProps {
  GoogleAPIMapKey: string;
  MarkerComponent: React.ComponentClass;
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

let map: google.maps.Map;
const initMap = function(
  position: { lat: number; lng: number },
  markers: { [K: string]: any }[],
  MarkerComponent: React.ComponentClass,
  mapState: MapResultViewState,
) {
  // @ts-ignore
  map = new google.maps.Map(document.getElementById('map'), {
    center: { ...position },
    zoom: 16,
    scrollwheel: true,
    // maxZoom: 16,
    // minZoom: 16,
    // styles: mapStyle,
  });

  // Create Marker
  function HTMLMarker(
    data: { lat: number; lng: number; [K: string]: any },
    index: number,
  ) {
    const { lat, lng, ...rest } = data;
    this.index = index;
    this.lat = lat;
    this.id = data.id;
    this.lng = lng;
    this.pos = new google.maps.LatLng(this.lat, this.lng);
    this.data = rest;
  }

  // @ts-ignore
  HTMLMarker.prototype = new google.maps.OverlayView();
  HTMLMarker.prototype.onRemove = function() {
    console.log('remove');
  };

  // @ts-ignore
  HTMLMarker.prototype.render = function(mapState: MapResultViewState) {
    this.div.style.zIndex = mapState.activeMarker === this.index ? 2 : 1;
    ReactDOM.render(
      //@ts-ignore
      <MarkerComponent
        {...this.data}
        map={mapState}
        isSelected={mapState.selectedMarkers.includes(this.index)}
        isActive={mapState.activeMarker === this.index}
        getMarkerProps={{
          onClick: () => {
            console.log('set');
            mapState.setActiveMarker(this.index);
          },
        }}
      />,
      this.div,
    );
  };

  // init your html element here
  HTMLMarker.prototype.onAdd = function() {
    console.log('add marker fire');
    this.div = document.createElement('div');
    this.div.className = 'my-marker';

    this.render(mapState);
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

  var bounds = new google.maps.LatLngBounds();

  //@ts-ignore
  const storedMarkers = [];
  //@ts-ignore
  markers.forEach((marker, index) => {
    //@ts-ignore
    var htmlMarker = new HTMLMarker(marker, index);
    htmlMarker.setMap(map);
    storedMarkers.push(htmlMarker);
    bounds.extend({ lat: marker.lat, lng: marker.lng });
    map.fitBounds(bounds);
  });

  //@ts-ignore
  return mapState => {
    //@ts-ignore
    storedMarkers.forEach(marker => {
      console.log(mapState.activeMarker);
      marker.render(mapState);
    });
  };
};

interface MapResultViewState {
  activeMarker: number;
  setActiveMarker: (id: number) => void;
  selectedMarkers: number[];
}

export class MapResultView extends React.Component<
  MapResultViewProps,
  MapResultViewState
> {
  target = React.createRef<HTMLDivElement>();
  clientX: number = 0;
  clientY: number = 0;
  scriptTag: HTMLScriptElement | undefined;

  setActiveMarker = (index: number) => {
    this.setState(
      prevState => {
        const newState = { activeMarker: index };
        if (!prevState.selectedMarkers.includes(index)) {
          // @ts-ignore
          newState.selectedMarkers = [...prevState.selectedMarkers, index];
        }
        return newState;
      },
      () => {
        this.markerClickCallback(this.state);
      },
    );
  };

  state: MapResultViewState = {
    activeMarker: -1,
    setActiveMarker: this.setActiveMarker,
    selectedMarkers: [],
  };

  markerClickCallback: (state: MapResultViewState) => void = () => {};

  constructor(props: MapResultViewProps) {
    super(props);
  }

  componentDidMount() {
    const position = { lat: this.props.data.lat, lng: this.props.data.lng };
    if (!map) {
      this.scriptTag = document.createElement('script');
      // @ts-ignore
      this.id = 'google-map';
      this.scriptTag.async = true;
      this.scriptTag.defer = true;
      this.scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${
        this.props.GoogleAPIMapKey
      }`;

      document.body.appendChild(this.scriptTag);
      // @ts-ignore
      this.scriptTag.onload = () => {
        this.markerClickCallback = initMap(
          position,
          this.props.data.markers,
          this.props.MarkerComponent,
          this.state,
        );
      };
    } else {
      this.markerClickCallback = initMap(
        position,
        this.props.data.markers,
        this.props.MarkerComponent,
        this.state,
      );
    }
  }

  componentWillReceiveProps(nextProps: MapResultViewProps) {
    if (nextProps.data !== this.props.data) {
      const position = { lat: nextProps.data.lat, lng: nextProps.data.lng };
      this.setState(
        {
          activeMarker: -1,
          selectedMarkers: [],
        },
        () => {
          this.markerClickCallback = this.markerClickCallback = initMap(
            position,
            nextProps.data.markers,
            nextProps.MarkerComponent,
            this.state,
          );
        },
      );
    }
  }

  render() {
    return (
      <div
        id="map"
        ref={this.target}
        style={{ height: '1000px' }}
        onMouseDown={e => {
          this.clientX = e.clientX;
          this.clientY = e.clientY;
        }}
        onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => {
          //@ts-ignore
          console.log(closestById(e.target, 'my-marker'));
          if (
            //@ts-ignore
            !closestById(e.target, 'my-marker') &&
            (this.clientX === e.clientX && this.clientY === e.clientY)
          ) {
            this.setActiveMarker(-1);
          }
        }}
      />
    );
  }
}

function closestById(el: HTMLElement, className: string) {
  while (el.className != className) {
    //@ts-ignore
    el = el.parentNode;
    if (!el) {
      return null;
    }
  }
  return el;
}
