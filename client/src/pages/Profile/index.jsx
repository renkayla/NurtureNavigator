import React from 'react'
import PlantNote from "../../components/PlantNote";
import AddPlantNote from "../../components/AddPlantNote";
import  {useState} from "react"

const ProfilePage = () => {
    const [plantNotes, setPlantNotes] = useState([
      { id: 1, plantName: "Sunflower", note: "Water every 2 days." },
      { id: 2, plantName: "Rose", note: "Prune once a month." },
      { id: 3, plantName: "Lavender", note: "Keep in direct sunlight." },
    ]);
  
    const addPlantNote = (newPlantNote) => {
      setPlantNotes([...plantNotes, newPlantNote]);
    };
  
    return (
      <div>
        <h1>Welcome to your Plant Manager Profile</h1>
        <h2>Your Plant Notes:</h2>
        {plantNotes.map((note) => (
          <PlantNote key={note.id} plantNote={note} />
        ))}
        <AddPlantNote onAddPlantNote={addPlantNote} />
      </div>
    );
  };

  export default ProfilePage;
  
