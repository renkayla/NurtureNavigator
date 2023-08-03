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
  species: {
    type: String,
    required: true,
  },
  waterNeeds: {
    type: String,
    required: true,
  },
  lightNeeds: {
    type: String,
    required: true,
  },
  nutrientNeeds: {
    type: String,
    required: true,
  },
  commonName: String,
  scientificName: String,
  family: String,
  origin: String,
  wateringFrequency: String,
  lightCondition: String,
  petFriendly: Boolean,
  plantDescription: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  }
});

module.exports = mongoose.model('Plant', PlantSchema);
