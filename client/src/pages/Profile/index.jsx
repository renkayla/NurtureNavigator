import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantNote from "../../components/PlantNote";
import AddPlantNote from "../../components/AddPlantNote";
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_USER_DATA, ADD_PLANT } from '../../utils/mutations';
import AuthService from '../../utils/auth'; 

const Profile = () => {
  let navigate = useNavigate();
  const [plantNotes, setPlantNotes] = useState([]);
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  
  // Get the user's _id from the decoded JWT token
  const profile = AuthService.getProfile();
  const userId = profile.data._id; // Assuming the token has an _id field

  // Define addPlant and addPlantError using useMutation
  const [addPlant, { error: addPlantError }] = useMutation(ADD_PLANT);

  console.log("User ID:", userId);
  const { loading, error, data } = useQuery(GET_USER_DATA, {
    variables: { userId: userId },
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 -m-10 py-20 lg:py-28">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Welcome, {userData ? userData.username : 'Loading...'}!
            </h1>
            <h2 className="text-2xl text-gray-700 mb-6 border-b pb-2">Your Plant Notes:</h2>
            <div className="space-y-4 mt-4">
                {plantNotes.length > 0 ? (
                    plantNotes.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                            <PlantNote plantNote={note} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 italic">You have no plant notes yet.</p>
                )}
            </div>
            <div className="mt-8">
                <AddPlantNote onAddPlantNote={addPlantNote} />
            </div>
        </div>
    </div>

  );
};

export default Profile;
