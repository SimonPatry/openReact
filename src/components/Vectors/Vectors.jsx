import axios from 'axios';
import { fetchPost } from '../../utils/fetch';

/* newVector
  Return an object vector with datas for vectorLayer 
*/
export const newVector = (pos, vectors) => {

  const fts = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [pos[0] - 0.0005, pos[1] - 0.0005],
          [pos[0] + 0.0005, pos[1] - 0.0005],
          [pos[0] + 0.0005, pos[1] + 0.0005],
          [pos[0] - 0.0005, pos[1] + 0.0005]
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
  const id = vectors.length ? vectors[vectors.length -1].vectorsId + 1 : 0;

  // TESTS FOR INDEX
  
  console.log("vectors.length: " + vectors.length);
  if (vectors.length > 0) {
    console.log("last vector ID: " + vectors[0].vectorsId);
    console.log("vector: " + vectors[vectors.legnth-1])
  }
  console.log("id: " + id)


  return {
    "vectorId": id,
    "show": true,
    "comments": {},
    "geo" : {
      "type": "FeatureCollection",
      "features": fts,
    }
  };
};


export const addNewVector = async (coords, vectors, setVectors) => {
  const { REACT_APP_ADD_VECTOR } = process.env;
  const vec = newVector(coords, vectors)
  //vectors.push(vec);
  setVectors([vec]);
  console.log(vectors)
  try{
    await fetchPost(REACT_APP_ADD_VECTOR, vec)
      .then(res => {
        console.log(res)
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