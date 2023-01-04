import React, { useRef, useState, useEffect } from "react"
import "./map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import {fetchPost} from "../../utils/fetch";
import { openSelectCommentFromVector } from "../Comments/Comments";

const newVector = (pos, vectors) => {
  const name = `vector${vectors.length}`;
  const fts = JSON.stringify([
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
  ]);
  return {
    "vectorId": vectors[vectors.length -1].vectorId + 1,
    "type": "FeatureCollection",
    "features": fts,
  };
};

const addNewVector = async (coords, vectors) => {
  console.log(vectors)
  const { REACT_APP_ADD_VECTOR } = process.env;
  try{
    await fetchPost(REACT_APP_ADD_VECTOR, newVector(coords, vectors))
      .then(res => {
        console.log(res);
      })
  } catch(e) {
    console.error(e);
  }
}

const Map = ({ children, zoom, center, setVectors, vectors, updateCenter, comments, updateComments }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
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

    const handleMapClick = (e) => {
      const selectedObject = mapObject.forEachFeatureAtPixel((e.pixel), (feature, layer) => {
        return layer;
      })
      if (selectedObject != undefined) {
        console.log(selectedObject)
        console.log(comments);
        openSelectCommentFromVector(0, comments, updateComments)
      }
      else {
        addNewVector(e.coordinate, vectors);
        updateCenter(e.coordinate);
      }
    }
    mapObject.on('click', (e) => handleMapClick(e))
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);

  }, [zoom, center, setVectors, vectors]);

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
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
    </MapContext.Provider>
  )
}
export default Map;