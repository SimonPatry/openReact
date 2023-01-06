import React, { useRef, useState, useEffect, useContext } from "react"
import "./map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import AppContext from "../../context/AppContext";
import { newVector} from '../Vectors/Vectors';
import { openSelectCommentFromVector } from "../Comments/Comments";

const Map = ({ children, zoom, center, updateCenter, updateVectors}) => {
  
  const { vectors, setVectors, setDrawer, setNewVctr } = useContext(AppContext);

  const mapRef = useRef();
  const [map, setMap] = useState();

  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: []
    };
    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    const handleMapClick = (e) => {

      // Checking if click was on an existing vector
      console.log("onclick")
      console.log(vectors)
      const selectedObject = mapObject.forEachFeatureAtPixel((e.pixel), (feature, layer) => {
        return layer;
      })

      // If click is on a vector open link to comment
      if (selectedObject !== undefined) {
        console.log(selectedObject)
        
        // openSelectCommentFromVector(0, comments, updateComments)
      }
      //else creates a new vector
      else {
        // flag telling react we are creating a new vector.
        // means vec is created and ushed in an array but is valid and send to db only when comment is wrote and linked to it else it's DESTROYED

        setNewVctr(true);

        const vec = newVector(e.coordinate, vectors)
        updateVectors([
          ...vectors,
          vec
        ]);
        console.log("vector pushed");
        console.log(vectors)
        updateCenter(e.coordinate);
      }
      setDrawer(true);
    }
    mapObject.on('click', (e) => {
      handleMapClick(e)
    })
    return () => mapObject.setTarget(undefined);

  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center)
  }, [center])

  
  return (
    <MapContext.Provider value={{ map }}>
      <div ref={mapRef} className="ol-map" >
        {children}
      </div>
    </MapContext.Provider>
  )
}
export default Map;