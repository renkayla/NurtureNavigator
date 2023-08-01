require('dotenv').config();
const User = require('../models/User');
const Plant = require('../models/Plant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const getPlantData = require('../api/plantApi');
const { validateRegisterInput, validateLoginInput } = require('../util/validators');

// Create a token for user
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
}

const resolvers = {
  Query: {
    async getUsers(){
        try {
            const users = await User.find();
            return users;
          } catch(err) {
            throw new Error(err);
          } // logic to fetch all users
    },
    async getUser(_, { userId }){
        try {
            const user = await User.findById(userId);
            if (user) {
              return user;
            } else {
              throw new Error('User not found');
            }
          } catch(err) {
            throw new Error(err);
          } // logic to fetch a user by userId
    },
    async getPlant(_, { plantId }){
        const plantData = await getPlantData(plantId);
        return plantData;
    },
  },
  
  Mutation: {
    async register(_, { registerInput: { username, email, password, confirmPassword }}){
      // 1. Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // 2. Make sure user doesn't already exist
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }

      // Hash the user's password and create a new user.
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      // 3. create an auth token
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },
    async login(_, { username, password }){
      // 1. Validate user data
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // 2. Check if user exists
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      // 3. Match password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      // 4. Return jwt token
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async addPlant(_, { userId, name, species, waterNeeds, lightNeeds, nutrientNeeds },) {
        // First, find the user by userId
        const user = await User.findById(userId);
        
        if (user) {
          // If user is found, create a new plant
          const newPlant = new Plant({
            name,
            species,
            waterNeeds,
            lightNeeds,
            nutrientNeeds,
            user: user.id,
          });
          
          // Save the plant
          const plant = await newPlant.save();
      
          // Add the plant to the user's plants
          user.plants.push(plant);
          await user.save();
      
          return plant;
        } else {
          throw new Error('User not found');
        }
      },
      
      async updatePlantCare(_, { plantId, lastWatered, lastLight, lastNutrient }, context) {
        // Find the plant by plantId
        const plant = await Plant.findById(plantId);
        
        if (plant) {
          // If plant is found, update the care details
          plant.lastWatered = lastWatered;
          plant.lastLight = lastLight;
          plant.lastNutrient = lastNutrient;
          
          // Save the plant
          await plant.save();
      
          return plant;
        } else {
          throw new Error('Plant not found');
        }
      },
      
  },
};

module.exports = resolvers;
