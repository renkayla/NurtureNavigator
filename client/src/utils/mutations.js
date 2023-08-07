import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!) {
    addOrder(products: $products) {
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        category {
          name
        }
      }
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


