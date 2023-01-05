import React, { useRef, useState, useEffect, useContext } from "react"
import "./map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import {fetchPost} from "../../utils/fetch";
import { openSelectCommentFromVector } from "../Comments/Comments";
import AppContext from "../../context/AppContext";

/* newVector
  Return an geoJSON format object readable by
  vectorLayer later   
*/
const newVector = (pos, vectors) => {
  const name = `vector${vectors.length}`;

  // features array in geoJSON object is stringified - for now - allowing it in rails to be added in db
  const fts = [
    {
      "type": "Feature",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [pos[0] - 0.0005, pos[1] - 0.0005],
              [pos[0] + 0.0005, pos[1] - 0.0005],
              [pos[0] + 0.0005, pos[1] + 0.0005],
              [pos[0] - 0.0005, pos[1] + 0.0005]
            ]
          ]
        ]
      }
    }
  ];
  // comments are stringified for the same reason 
  const cmts = JSON.stringify([]);
/*
    Vector structure:
      - ID unique to each vectors
      - flag show checked when map is rendered to draw or not the vector
      - comments is an array of objects comment containings datas from each comments
      - type and features are required in the geoJSON format
*/
  const id = vectors.length ? vectors[vectors.length -1].vectorsId + 1 : 0;
  console.log(id)
  return {
    "vectorId": id,
    "show": true,
    "comments": cmts,
    "geo" : {
      "type": "FeatureCollection",
      "features": fts,
    }
  };
};


const addNewVector = async (coords, vectors, setVectors) => {
  // console.log(vectors)
  // vectors.push(newVector(coords, vectors))
  // setVectors([
  //   ...vectors,
  //   newVector(coords, vectors)
  // ])
  console.log(vectors)
  const { REACT_APP_ADD_VECTOR } = process.env;
  try{
    const vec = newVector(coords, vectors)
    await fetchPost(REACT_APP_ADD_VECTOR, vec)
      .then(res => {
        console.log(vec)
        vectors.push(vec)
      })
  } catch(e) {
    console.error(e);
  }
}

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