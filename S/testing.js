let plantData = plant._doc;
return {
  id: plantData._id.toString(),
  name: plantData.name || 'Unknown',
  species: plantData.species || 'Unknown',
  waterNeeds: plantData.waterNeeds || 'Unknown',
  lightNeeds: plantData.lightNeeds || 'Unknown',
  nutrientNeeds: plantData.nutrientNeeds || 'Unknown',
  wateringFrequency: plantData.wateringFrequency || 'Unknown',
  lastLight: plantData.lastLight ? plantData.lastLight : new Date(),
  lastWatered: plantData.lastWatered ? plantData.lastWatered : new Date(),
  lastFed: plantData.lastFed ? plantData.lastFed : new Date(),
  lastNutrient: plantData.lastNutrient ? plantData.lastNutrient : new Date(),
  userId: plantData.user._Id.toString(),
}