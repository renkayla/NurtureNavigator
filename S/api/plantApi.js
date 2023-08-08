const axios = require('axios');

async function getPlantData(plantId) {
  try {
    const response = await axios.get(`https://perenual.com/docs/api/${plantId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getPlantData;
