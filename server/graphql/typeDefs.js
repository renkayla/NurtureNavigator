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
  }

  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
    getPlants: [Plant]
    getPlant(plantId: ID!): Plant
  }
  
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    addPlant(name: String!, species: String!, waterNeeds: String!, lightNeeds: String!, nutrientNeeds: String!): Plant!
    updatePlantCare(plantId: ID!, lastWatered: Date!, lastLight: Date!, lastNutrient: Date!): Plant!
  }
  
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
`;

module.exports = typeDefs;
