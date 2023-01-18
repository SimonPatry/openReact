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
import NavBar from './components/NavBar/NavBar'
import {getVectors} from './components/Vectors/Vectors';
import AppContext from './context/AppContext';

let styles = {
  'Polygon': new Style({
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
  const [center, setCenter] = useState(mapConfig.center); // open map on this coordinates
  const [zoom, setZoom] = useState(9); // zoom level init
  const [drawer, setDrawer] = useState(false); // comment's drawer state (open/close => true/false)
  const [switchLayer, setSwitchLayer] = useState(true); //toggle for normal vue and thermal vue of the park
  const [vectors, setVectors] = useState([]); // list of vectors/problems 
  const [newVctr, setNewVctr] = useState(false); // A vector's creation contain multiple steps , to ensure the creation is or isn't ongoing this var is set to true or false, allowing us to delete or send the new vector depending if the creation steps are interrupted or not

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

  useEffect(() => {
    console.log("vectors modified");
    console.log(vectors);
  },[vectors])

  // using provider to avoid state lifting on vectors and drawer allowinf us to control those elements from here 
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
        
        <div className='mapBlock'>
          <Map 
            center={center} 
            updateCenter={setCenter} 
            zoom={zoom}
            updateVectors={setVectors}
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
              
            </Layers>
            <Controls>
              <FullScreenControls />
            </Controls>
          </Map>
        </div>
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