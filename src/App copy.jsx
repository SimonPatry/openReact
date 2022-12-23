import './App.css';
import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route, Link,
} from "react-router-dom";

import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { osm, vector } from "./Source";
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { Controls, FullScreenControl } from "./Controls";

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

const App = () => {

  // Données de context
  let providerData = {
  
  };

  return (
    <AppContext.Provider value={providerData}>
      <div className="App">
        <Router>
          <header className="App-header">
            <div>
              <Link to="/">Home</Link>
            </div>
            <nav>
              <Link to="#">Inpsections</Link>
            </nav>
          </header>
          <div className="globalContainer">
            <Routes>
              <Route exact path="/" />
              <Route exact path="/inspect" />
            </Routes>
          </div>
        </Router>
      </div>
    </AppContext.Provider>
  );
}

export default App;