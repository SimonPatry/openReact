import React, { useState, useEffect } from 'react';
import './App.css';
import Map from "./components/Map/Map";
import Layers from "./components/Layers/Layers";
import TileLayer from './components/Layers/TileLayer';
import VectorLayer from './components/Layers/VectorLayer';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { osm, vector, xyz } from "./components/Sources";
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import Controls from "./components/Controls/Controls";
import FullScreenControls from "./components/Controls/FullScreenControls"
import mapConfig from "./config.json";
import {CommentsDrawer} from './components/Comments/Comments';
import Button from '@mui/material/Button';
import NavBar from './components/NavBar/NavBar'
import getVectors from './components/Vectors/Vectors';
import AppContext from './context/AppContext';

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
  'MultiPolygonSelected': new Style({
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
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(9);
  const [drawer, setDrawer] = useState(false);
  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [switchLayer, setSwitchLayer] = useState(true);
  const [vectors, setVectors] = useState([]);
  const [newVctr, setNewVctr] = useState(false);
  const [comments, setComments] = useState([
    {
        id: 0,
        title: 'title',
        content: "lorem ipsum",
        author: 'Jhon Doe',
        vector: 0,
        selected: false,
        edit: false,
    },
    {
        id: 1,
        title: 'title',
        content: "lorem ipsum",
        author: 'Jhon Doe',
        vector: 1,
        selected: false,
        edit: false,
    }
  ]);

  const fetchVectors = async () => {
    console.log("request vectors")
    return await getVectors();
  };

  useEffect(() => {
    fetchVectors().then((fetchedVectors) => {
      console.log("importing from db")
      setVectors(fetchedVectors);
    })

  }, []);
  
const providerData = {
  vectors,
  setVectors,
  drawer,
  setDrawer,
  newVctr,
  setNewVctr
}

  return (
    <AppContext.Provider value={providerData}>
      <div className="container">
        <NavBar />
        <div className='commentsBlock'>
          <CommentsDrawer 
            comments={comments} 
            updateComments={setComments} 
            vectors={vectors} 
            updateVectors={setVectors} />
        </div>
        <div className='mapBlock'>
          <Map 
            center={center} 
            updateCenter={setCenter} 
            zoom={zoom} 
            
            comments={comments}
            updateComments={setComments}
          >
            <Layers>
              { switchLayer && 
                  <TileLayer
                  source={xyz({url:"https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=286831b17c1c4850a525905a5f4ba171"}
                  )}
                  zIndex={0}
                />
              }
              { !switchLayer && 
                  <TileLayer
                  source={osm()}
                  zIndex={0}
                />
              }
              { vectors.length > 0 && (
                vectors.map((vtr) => {
                  console.log(vtr)
                  return (
                    <VectorLayer key={vtr.vectorId}
                      source={vector({ 
                      features: new GeoJSON().readFeatures(vtr.geo, { featureProjection: get('EPSG:3857') }) 
                    })}
                      style={styles.MultiPolygon}
                    />
                  );
                })
              )}
            </Layers>
            <Controls>
              <FullScreenControls />
            </Controls>
          </Map>
        </div>
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
          <div>
            <input
              type="checkbox"
              checked={switchLayer}
              onChange={event => setSwitchLayer(event.target.checked)} />{switchLayer ? "Normal vue" : " Thermal vue"}
        </div>
      </div>
    </AppContext.Provider>
    
  );
}
export default App;