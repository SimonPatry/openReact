import React, { useRef, useState, useEffect, useContext } from "react"
import "./map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import {fetchPost} from "../../utils/fetch";
import { openSelectCommentFromVector } from "../Comments/Comments";
import AppContext from "../../context/AppContext";
import { addNewVector, newVector} from '../Vectors/Vectors';

const Map = ({ children, zoom, center, updateCenter, comments, updateComments }) => {
  
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
      const selectedObject = mapObject.forEachFeatureAtPixel((e.pixel), (feature, layer) => {
        return layer;
      })
      if (selectedObject !== undefined) {
        console.log(selectedObject)
        console.log(comments);
        openSelectCommentFromVector(0, comments, updateComments)
      }
      else {
        if (vectors.length >0)
          console.log(vectors[vectors.length -1].vectorId)
        setNewVctr(true);
        addNewVector(e.coordinate, vectors, setVectors);
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