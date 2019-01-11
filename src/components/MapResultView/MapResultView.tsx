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

let map: any;
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

  HTMLMarker.prototype.render = function(mapState: MapResultViewState) {
    ReactDOM.render(
      //@ts-ignore
      <MarkerComponent {...this.data} map={mapState} />,
      this.div,
    );
  };

  // init your html element here
  HTMLMarker.prototype.onAdd = function() {
    console.log('add');
    this.div = document.createElement('div');
    this.div.className = 'my-marker';
    // let span = document.createElement('span');
    // span.innerHTML = this.data.name;
    // this.div.appendChild(span);
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

  //@ts-ignore
  const storedMarkers = [];
  //@ts-ignore
  markers.forEach(marker => {
    //@ts-ignore
    var htmlMarker = new HTMLMarker(marker);
    htmlMarker.setMap(map);
    storedMarkers.push(htmlMarker);

    //@ts-ignore
    // new google.maps.Marker({
    //   //@ts-ignore
    //   position: new google.maps.LatLng(marker.lat, marker.lng),
    //   map: map,
    // });
  });

  //@ts-ignore
  // storedMarkers.forEach(marker => {
  //   marker.render();
  // });

  return mapState => {
    //@ts-ignore
    storedMarkers.forEach(marker => {
      console.log(mapState.activeMarkupId);
      marker.render(mapState);
    });
  };
};

interface MapResultViewState {
  activeMarkupId: number;
  setActiveMarkupId: (id: number) => void;
}

export class MapResultView extends React.Component<
  MapResultViewProps,
  MapResultViewState
> {
  target = React.createRef<HTMLDivElement>();
  s: HTMLScriptElement | undefined;

  setActiveMarkupId = (id: number) => {
    this.setState({ activeMarkupId: id }, () => {
      this.test(this.state);
    });
  };

  state: MapResultViewState = {
    activeMarkupId: 0,
    setActiveMarkupId: this.setActiveMarkupId,
  };

  test: (state: MapResultViewState) => void = () => {};

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
        this.test = initMap(
          position,
          this.props.data.markers,
          this.props.MarkerComponent,
          this.state,
        );
      };
    } else {
      this.test = initMap(
        position,
        this.props.data.markers,
        this.props.MarkerComponent,
        this.state,
      );
    }
  }

  clientX: number = 0;
  clientY: number = 0;

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
        onMouseUp={(e: React.MouseEvent) => {
          //@ts-ignore
          console.log(closestById(e.target, 'my-marker'));
          //@ts-ignore
          if (
            //@ts-ignore
            !closestById(e.target, 'my-marker') &&
            (this.clientX === e.clientX && this.clientY === e.clientY)
          ) {
            this.setActiveMarkupId(0);
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
