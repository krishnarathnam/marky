import React, { useState } from "react";

export default function PromptModal({
  type, // "folder" or "note"
  setName, // Function to set name (folder or note name)
  closeModal,
  createItem, // Function to create folder or note
  defaultName = "" // Default value for the name field
}) {
  const [name, setNameState] = useState(defaultName);

  const handleChange = (e) => {
    setNameState(e.target.value);
    setName(e.target.value); // Update parent state
  };

  const handleCreate = () => {
    createItem(name); // Call the function to create folder/note
    closeModal(); // Close the modal
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 bg-opacity-50 fixed inset-0 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-auto">
        <h2 className="text-xl font-semibold mb-4">{`Create a New ${type.charAt(0).toUpperCase() + type.slice(1)}`}</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4 rounded"
          placeholder={`Enter ${type} name`}
          value={name}
          onChange={handleChange}
        />
        <div className="flex justify-between">
          <button className="text-gray-600 border rounded p-2" onClick={closeModal}>Cancel</button>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
}
