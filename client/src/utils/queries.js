import gql from 'graphql-tag';

export const API_RESULTS = gql`
  query Api {
    api {
      data
    }
  }
`;
