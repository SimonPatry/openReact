import React, { useRef, useState, useEffect } from "react"
import "./map.css";
import MapContext from "./MapContext";
import * as ol from "ol";

const Map = ({ children, zoom, center, setVectors, vectors }) => {
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

    const newVector = () => {
      return {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "kind": "county",
              "name": "test",
              "state": "KS"
            },
            "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                [
                  [
                    [-80, 31],
                    [-85, 37],
                    [-83, 34],
                    [-88, 24],
                  ]
                ]
              ]
            }
          }
        ]
      };
    };

    const handleMapClick = () => {
      console.log();
      setVectors([
        ...vectors,
        newVector()
      ])
    }

    mapObject.on('click', handleMapClick)
    
    setMap(mapObject);
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
      <div ref={mapRef} className="ol-map">
        {children}
      </div>
      
    </MapContext.Provider>
  )
}
export default Map;