import axios from 'axios';

const getVectors = async () => {
    const { REACT_APP_VECTORS } = process.env
    try {
        const response = await axios.get(REACT_APP_VECTORS)
        const data = response.data
        data.features = JSON.parse(data.features);
        return data;
  
      } catch(error) {
        console.log(error);
      }
};

export default getVectors;