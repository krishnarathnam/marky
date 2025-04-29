import React from "react";
import SearchBar from "./SearchBar";
import Notes from "./Notes";

export default function NotesBar({ openModal, notes, onSelectedNote }) {
  if (!notes || notes.length === 0) {
    return <p>No notes available.</p>; // Display a message when no notes are available
  }
  return (
    <div className="bg-gray-50 border-[#d0cfcf] border-l-1 border-r-1 w-65 flex flex-col max-h-screen">
      <SearchBar openModal={openModal} />
      <div className="overflow-y-auto">
        {notes.map((note, index) => (
          <Notes note={note} index={index} onSelectedNote={onSelectedNote} />
        ))}
      </div>

    </div>
  );
}
