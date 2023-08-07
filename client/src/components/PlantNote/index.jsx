  import React from "react";

  const PlantNote = ({ plantNote }) => {
    const { plantName, note } = plantNote;
    return (
      <div>
        <h3>{plantName}</h3>
        <p>{note}</p>
      </div>
    );
  };
  
  
  export default PlantNote;