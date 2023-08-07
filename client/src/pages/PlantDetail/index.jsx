import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const PLANT_DETAIL_QUERY = gql`
  query GetPlant($id: ID!) {
    getPlant(plantId: $id) {
      id
      name
      species
      waterNeeds
      lightNeeds
      nutrientNeeds
      lastWatered
      lastLight
      lastNutrient
      commonName
      scientificName
      family
      origin
      wateringFrequency
      lightCondition
      petFriendly
      plantDescription
    }
  }
`;

function PlantDetail() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(PLANT_DETAIL_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const plant = data.getPlant;

  return (
    <div>
      <h1>{plant.name}</h1>
      <p>{plant.description}</p>
      {/* Render other plant details here */}
    </div>
  );
}

export default PlantDetail;
