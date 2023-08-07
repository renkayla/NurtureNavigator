import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNote from "../../components/PlantNote";
import AddPlantNote from "../../components/AddPlantNote";
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_USER_DATA, ADD_PLANT } from '../../utils/mutations'; 

const Profile = () => {
  let navigate = useNavigate();
  const [plantNotes, setPlantNotes] = useState([]);
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);

  // Define addPlant and addPlantError using useMutation
  const [addPlant, { error: addPlantError }] = useMutation(ADD_PLANT);

  const { loading, error, data } = useQuery(GET_USER_DATA, {
    variables: {
      userId: userData ? userData.id : null
    },
    skip: !token,
    context: {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (data && data.user && data.user.plants) {
      setUserData(data.user);
      setPlantNotes(data.user.plants);
    }
  }, [data]);
  
  if (loading) return 'Loading...';
  if (error) return `Error: ${error.message}`;


  const addPlantNote = async (newPlantNote) => {
    try {
      const { data } = await addPlant({
        variables: {
          ...newPlantNote,
          userId: userData.id
        }
      });
      if (data) {
        setPlantNotes(prevNotes => [...prevNotes, data.addPlant]);
      }
    } catch (err) {
      console.error("Error adding new plant:", err);
    }
  };
  
  if (addPlantError) {
    console.error("Error adding new plant:", addPlantError);
  }

  return (
    <div>
      <h1>Welcome, {userData ? userData.username : 'Loading...'}!</h1>
      <h2>Your Plant Notes:</h2>
      {plantNotes.length > 0 ? (
        plantNotes.map((note) => (
          <PlantNote key={note.id} plantNote={note} />
        ))
      ) : (
        <p>You have no plant notes yet.</p>
      )}
      <AddPlantNote onAddPlantNote={addPlantNote} />
    </div>
  );
};

export default Profile;
