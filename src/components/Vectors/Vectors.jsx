import axios from 'axios';

const getVectors = async () => {
    const { REACT_APP_VECTORS } = process.env
    try {
        const response = await axios.get(REACT_APP_VECTORS)
        const vectors = response.data
        if(vectors.length > 0) {
          vectors.forEach((vector) => {
            //vector.geo.features = JSON.parse(vector.geo.features);
            vector.comments = JSON.parse(vector.comments);
          })
        }

        return vectors;
  
      } catch(error) {
        console.log(error);
      }
};

export default getVectors;