require('dotenv').config();
const { ObjectId } = require('mongoose').Types;
const GraphQLJSON = require('graphql-type-json');
const User = require('../models/User');
const Plant = require('../models/Plant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const getPlantData = require('../api/plantApi');
const { validateRegisterInput, validateLoginInput } = require('../utils/validators');
const { signToken } = require("../utils/auth")

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
  Date: GraphQLJSON,
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      } // logic to fetch all users
    },
    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return user;
        } else {
          throw new Error('User not found');
        }
      } catch (err) {
        throw new Error(err);
      } // logic to fetch a user by userId
    },
    async getPlant(_, { plantId }) {
      try {
        const plant = await Plant.findById(plantId);
        if (plant) {
          return plant;
        } else {
          throw new Error('Plant not found');
        }
      } catch (err) {
        throw new Error(err);
      } // logic to fetch plant by Id
    },
    getAllPlants: async () => {
      try {
        let plants = await Plant.find().populate('user', 'username email').lean();
        
        plants = plants.map(plant => {
          // Convert ObjectId instances to strings
          const userId = plant.user._id.toString();
          return {
            ...plant,
            id: plant._id.toString(),
            userId,
            lastLight: plant.lastLight || new Date(),
            lastWatered: plant.lastWatered || new Date(),
            lastFed: plant.lastFed || new Date(),
            lastNutrient: plant.lastNutrient || new Date(),
          };
        });
        return plants;
      } catch (err) {
        throw new Error(err);
      } // logic to fetch all plants
    },
  },
  Mutation: {

    followUser: async (parent, { followerId, followeeId }, context) => {
      try {
        // First, update the follower's 'following' array
        const updatedFollower = await User.findByIdAndUpdate(
          followerId, 
          { $addToSet: { following: followeeId } }, 
          { new: true }
        );

        // Then, update the followee's 'followers' array
        const updatedFollowee = await User.findByIdAndUpdate(
          followeeId, 
          { $addToSet: { followers: followerId } }, 
          { new: true }
        );

        return updatedFollower; // Return the updated follower document
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    
    async register(_, { registerInput: { username, email, password, confirmPassword, firstName, lastName }}){
      // 1. Validate user data
      // Make sure to update validateRegisterInput to include firstName and lastName
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword, firstName, lastName);
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

      // 3. Ensure email doesn't already exist
      const userWithEmail = await User.findOne({ email });
      if (userWithEmail) {
        throw new UserInputError('Email is already registered', {
          errors: {
            email: 'This email is already registered'
          }
        });
      }

      // 4. Make sure passwords match
      if (password !== confirmPassword) {
        throw new UserInputError('Passwords do not match', {
          errors: {
            confirmPassword: 'Passwords do not match'
          }
        });
      }
    
      // 5. Hash the user's password and create a new user.
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password,
        firstName,
        lastName,
        createdAt: new Date().toISOString()
      });
    
      console.log('New user to be saved:', newUser);

      const res = await newUser.save();
    
      // 6. create an auth token
      const token = generateToken(res);
    
      return {
        ...res._doc,
        id: res._id,
        token
      };
    },
    
    async login(_, { username, password }) {
      const user = await User.findOne({ username });
      console.log('Found user:', user);
    
      if (!user) {
        throw new UserInputError('Wrong crendetials');
      }
      
      const match = await bcrypt.compare(password, user.password);
    
      console.log('Password match:', match);
    
      if (!match) {
        throw new UserInputError('Wrong crendetials');
      }
    
      const token = signToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    


    async addPlant(_, { userId, name, species, waterNeeds, lightNeeds, nutrientNeeds, commonName, scientificName, family, origin, wateringFrequency, lightCondition, petFriendly, plantDescription }) {
      const user = await User.findById(userId);

      if (user) {
        const newPlant = new Plant({
          name,
          species: species || 'unknown',
          userId: user._id,
          waterNeeds,
          lightNeeds,
          nutrientNeeds,
          commonName,
          scientificName,
          family,
          origin,
          wateringFrequency,
          lightCondition,
          petFriendly,
          plantDescription,
          user: user._id,
        });

        const plant = await newPlant.save();
        user.plants.push(plant);
        await user.save();

        return {
          ...plant._doc,
          id: plant._id,
          userId: user._id, // This returns the userId as part of the mutation's result
        };
      } else {
        throw new Error('User not found');
      }
    },
    
    async updatePlant(_, { plantId, species, waterNeeds, lightNeeds, nutrientNeeds, commonName, scientificName, family, origin, wateringFrequency, lightCondition, petFriendly, plantDescription }, context) {
      checkAuth(context);

      try {
        let plant = await Plant.findById(plantId);
        if (!plant) throw new Error('Plant not found');

        plant.species = species || plant.species;
        plant.waterNeeds = waterNeeds || plant.waterNeeds;
        plant.lightNeeds = lightNeeds || plant.lightNeeds;
        plant.nutrientNeeds = nutrientNeeds || plant.nutrientNeeds;
        plant.commonName = commonName || plant.commonName;
        plant.scientificName = scientificName || plant.scientificName;
        plant.family = family || plant.family;
        plant.origin = origin || plant.origin;
        plant.wateringFrequency = wateringFrequency || plant.wateringFrequency;
        plant.lightCondition = lightCondition || plant.lightCondition;
        plant.petFriendly = petFriendly !== undefined ? petFriendly : plant.petFriendly;
        plant.plantDescription = plantDescription || plant.plantDescription;

        const updatedPlant = await plant.save();

        return updatedPlant;
      } catch (err) {
        throw new Error(err);
      } // logic to update plant details
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
      } // logic to update plant care
    },
    deletePlant: async (_, { plantId }, context) => {
      // Verify the user is authenticated before allowing the delete
      checkAuth(context);

      try {
        const plant = await Plant.findById(plantId);
        if (!plant) throw new Error('Plant not found');

        if (plant.userId.toString() === context.user.id) {
          // User is allowed to delete this plant
          await plant.delete();
          return 'Plant deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      } // logic to delete plant
    },
  }
};

module.exports = resolvers;
