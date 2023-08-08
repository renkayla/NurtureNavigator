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
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Add a New Plant Note:</h3>
            <div>
                <label className="block text-sm font-medium text-gray-600">
                    Plant Name:
                </label>
                <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    required
                    className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600">
                    Note:
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                    className="mt-1 p-2 w-full h-24 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                />
            </div>
            <div>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                    Add Note
                </button>
            </div>
        </form>

    );
};

export default AddPlantNote;