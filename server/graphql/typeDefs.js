const { gql } = require('apollo-server');

const typeDefs = gql`
scalar Date

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    plants: [Plant]!
  }
  
  type Plant {
    id: ID!
    name: String!
    species: String!
    waterNeeds: String!
    lightNeeds: String!
    nutrientNeeds: String!
    lastWatered: Date!
    lastLight: Date!
    lastNutrient: Date!
    commonName: String
    scientificName: String
    family: String
    origin: String
    wateringFrequency: String
    lightCondition: String
    petFriendly: Boolean
    plantDescription: String
    userId: ID!
  }

  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
    getPlants: [Plant]
    getPlant(plantId: ID!): Plant
    getAllPlants: [Plant]
  }
  
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    addPlant(userId: ID!, name: String!, species: String!, waterNeeds: String!, lightNeeds: String!, nutrientNeeds: String!, commonName: String, scientificName: String, family: String, origin: String, wateringFrequency: String, lightCondition: String, petFriendly: Boolean, plantDescription: String): Plant!
    updatePlant(plantId: ID!, species: String, waterNeeds: String, lightNeeds: String, NutrientNeeds: String, commonName: String, scientificName: String, family: String, origin: String, wateringFrequency: String, lightCondition: String, petFriendly: Boolean, plantDescription: String): Plant
    updatePlantCare(plantId: ID!, lastWatered: Date!, lastLight: Date!, lastNutrient: Date!): Plant!
    deletePlant(plantId: ID!): String!
  }
  
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
`;

module.exports = typeDefs;
