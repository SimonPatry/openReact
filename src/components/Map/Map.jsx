import React, { useRef, useState, useEffect } from "react"
import "./map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import { fromLonLat } from "ol/proj";
import { openSelectCommentFromVector } from "../Comments/Comments";

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

    const newVector = (pos) => {
      const name = `vector${vectors.length}`;

      return {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "kind": "county",
              "name": name,
              "state": "KS"
            },
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
        ]
      };
    };

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
        console.log(e.coordinate);
        console.log(center)
        setVectors([
          ...vectors,
          newVector(e.coordinate)
        ])
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