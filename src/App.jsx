import React, { useState, useEffect } from 'react';
import './App.css';
import Map from "./components/Map/Map";
import Layers from "./components/Layers/Layers";
import TileLayer from './components/Layers/TileLayer';
import VectorLayer from './components/Layers/VectorLayer';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { osm, vector } from "./components/Sources";
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import Controls from "./components/Controls/Controls";
import FullScreenControls from "./components/Controls/FullScreenControls"
import mapConfig from "./config.json";

let styles = {
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
};

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];


const App = () => {
  const [center, setCenter] = useState([-94.9065, 38.9884]);
  const [zoom, setZoom] = useState(9);
  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
return (
  <div>
    <Map center={fromLonLat(center)} zoom={zoom}>
      <Layers>
        <TileLayer
          source={osm()}
          zIndex={0}
        />
        {showLayer1 && (
          <VectorLayer
            source={vector({ features: new GeoJSON().readFeatures(geojsonObject, { featureProjection: get('EPSG:3857') }) })}
            style={styles.MultiPolygon}
          />
        )}
        {showLayer2 && (
          <VectorLayer
            source={vector({ features: new          GeoJSON().readFeatures(geojsonObject2, { featureProjection:               get('EPSG:3857') }) })}
            style={styles.MultiPolygon}
          />
        )}
      </Layers>
      <Controls>
        <FullScreenControls />
      </Controls>
    </Map>
    <div>
      <input
        type="checkbox"
        checked={showLayer1}
        onChange={event => setShowLayer1(event.target.checked)}
      /> Johnson County
    </div>
    <div>
      <input
        type="checkbox"
        checked={showLayer2}
        onChange={event => setShowLayer2(event.target.checked)}
      /> Wyandotte County</div>
    </div>
  );
}
export default App;