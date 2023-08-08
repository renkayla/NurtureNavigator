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
const { checkAuth } = require('../utils/auth');

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
    api: async (parent, args, context) => {
      console.log("API resolver called"); // <-- Add this
    
      // if (context.user) {
        const response = await getPlantData();
        return response;
      // }
    
      // throw new AuthenticationError("Not logged in");
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
    
    async updatePlant(_, { plantInput }, context) {
      // Use the checkAuth function
      const currentUser = checkAuth(context);

      if (!currentUser) {
        throw new AuthenticationError('You must be logged in!');
      }

      const updatedPlant = await Plant.findOneAndUpdate(
        { _id: plantInput.plantId, userId: currentUser._id }, 
        { $set: plantInput },
        { new: true }
      );

      return updatedPlant;
    },

    async updatePlantCare(_, { plantCareInput }, context) {
      // Use the checkAuth function
      const currentUser = checkAuth(context);

      if (!currentUser) {
        throw new AuthenticationError('You must be logged in!');
      }

      const updatedPlantCare = await Plant.findOneAndUpdate(
        { _id: plantCareInput.plantId, userId: currentUser._id }, 
        { $set: { care: plantCareInput } },
        { new: true }
      );

      return updatedPlantCare;
    },

    async deletePlant(_, { plantId }, context) {
      // Use the checkAuth function
      const currentUser = checkAuth(context);

      if (!currentUser) {
        throw new AuthenticationError('You must be logged in!');
      }

      const deletedPlant = await Plant.findOneAndDelete(
        { _id: plantId, userId: currentUser._id }
      );

      return deletedPlant;
    },

  }
};

module.exports = resolvers;
