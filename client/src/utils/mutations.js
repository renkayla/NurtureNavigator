import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      id
      username
    }
  }
`;


export const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    register(registerInput: { username: $username, email: $email, password: $password, confirmPassword: $password, firstName: $firstName, lastName: $lastName }) {
      id
      email
      token
      username
      createdAt
      plants {
        id
        name
      }
    }
  }
`;


export const ADD_PLANT = gql`
  mutation AddPlant($name: String!, $species: String!, $waterNeeds: String!, $lightNeeds: String!, $nutrientNeeds: String!, $userId: ID!) {
    addPlant(name: $name, species: $species, waterNeeds: $waterNeeds, lightNeeds: $lightNeeds, nutrientNeeds: $nutrientNeeds, userId: $userId) {
      id
      name
      species
      waterNeeds
      lightNeeds
      nutrientNeeds
    }
  }
`;

export const GET_USER_DATA = gql`
  query GetUserData($userId: ID!) {
    getUser(userId: $userId) {
      username
      plants {
        id
        name
      }
    }
  }
`;

