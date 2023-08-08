const axios = require('axios');

async function getPlantData() {
  const key = process.env.API_KEY;
  try {
    const response = await axios.get(`https://perenual.com/api/species-list?page=1&key=${key}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getPlantData;
