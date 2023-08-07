import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import  AuthService  from '../../utils/auth';
import { ADD_PLANT } from '../../utils/mutations.js';


function AddPlant() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [waterNeeds, setWaterNeeds] = useState('');
  const [lightNeeds, setLightNeeds] = useState('');
  const [nutrientNeeds, setNutrientNeeds] = useState('');

  const [addPlant] = useMutation(ADD_PLANT);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
  
      const userProfile = AuthService.getProfile();  // Decode the JWT to get the user's profile data
      const userId = userProfile._id;  // Get the user's ID from the profile data
    
    // Use the user ID in the mutation
      await addPlant({ variables: { name, species, waterNeeds, lightNeeds, nutrientNeeds, userId } }); // Replace "YOUR_USER_ID" with the actual ID of the user
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Name:
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Species:
        <input value={species} onChange={e => setSpecies(e.target.value)} />
      </label>
      <label>
        Water Needs:
        <input value={waterNeeds} onChange={e => setWaterNeeds(e.target.value)} />
      </label>
      <label>
        Light Needs:
        <input value={lightNeeds} onChange={e => setLightNeeds(e.target.value)} />
      </label>
      <label>
        Nutrient Needs:
        <input value={nutrientNeeds} onChange={e => setNutrientNeeds(e.target.value)} />
      </label>
      <button type="submit">Add Plant</button>
    </form>
  );
}

export default AddPlant;
