const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastWatered: {
    type: Date,
    default: Date.now
  },
  lastFed: {
    type: Date,
    default: Date.now
  },
  // add more fields as needed based on API data and application's needs
});

module.exports = mongoose.model('Plant', PlantSchema);
