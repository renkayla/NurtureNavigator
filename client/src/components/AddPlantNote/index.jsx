import React, { useState } from "react";

const AddPlantNote = ({ onAddPlantNote }) => {
    const [plantName, setPlantName] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPlantNote = {
            id: Date.now(),
            plantName,
            note,
        };
        onAddPlantNote(newPlantNote);
        setPlantName("");
        setNote("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add a New Plant Note:</h3>
            <label>
                Plant Name:
                <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    required
                />
            </label>
            <label>
                Note:
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Add Note</button>
        </form>
    );
};

export default AddPlantNote;