import axios from 'axios';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { fetchPost } from '../../utils/fetch';
import { toLonLat } from 'ol/proj';

/* newVector
  Return an object vector with datas for vectorLayer 
*/
export const newVector = (pos, vectors) => {

  const fts = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "properties": {
          "kind": "county",
          "name": "Wyandotte",
          "state": "KS"
        },
        "coordinates": [
          [
            toLonLat([pos[0] - 0.0005, pos[1] - 0.0005]),
            toLonLat([pos[0] + 0.0005, pos[1] - 0.0005]),
            toLonLat([pos[0] + 0.0005, pos[1] + 0.0005]),
            toLonLat([pos[0] - 0.0005, pos[1] + 0.0005])
          ]
        ]
      }
    }
  ];

/*
    Vector structure:
      - ID unique to each vectors
      - flag show checked when map is rendered to draw or not the vector
      - comments is an array of objects comment containings datas from each comments
      - geoJSON object containing a type:string and features:array see the geoJSON doc for specific features content
*/
  const id = vectors.length ? vectors[vectors.length -1].vectorId + 1 : 0;

  return {
    "vectorId": id,
    "show": true,
    "comment": {
      title: '',
      content: '',
      edit: false,
      selected: false,
    },
    "geo" : {
      "type": "FeatureCollection",
      "features": fts,
    }
  };
};

/* Send new vector to back and db */
export const createNewVector = async (vectors) => {
  const { REACT_APP_ADD_VECTOR } = process.env;

  const vector = vectors[vectors.length -1];
  try{
    await fetchPost(REACT_APP_ADD_VECTOR, vector)
      .then(res => {
        console.log(res);
      })
  } catch(e) {
    console.error(e);
    vectors.pop();
  }
}

export const getVectors = async () => {
    const { REACT_APP_VECTORS } = process.env
    try {
        const response = await axios.get(REACT_APP_VECTORS)
        const vectors = response.data;
        return vectors;
  
      } catch(error) {
        console.log(error);
      }
};