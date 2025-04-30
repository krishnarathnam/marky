import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Notes from "./Notes";

export default function NotesBar({ onRenameNote, onDeleteNote, openModal, notes, onSelectedNote }) {
  const [openToolbarIndex, setOpenToolbarIndex] = useState(null);

  useEffect(() => {
    const handleClick = () => setOpenToolbarIndex(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!notes || notes.length === 0) {
    return (
      <div className="border-border border-l-1 border-r-1 w-65 flex flex-col ">
        <SearchBar openModal={openModal} />
        <hr className="border-border" />
        <div className="text-black font-bold text-sm justify-center">
          <p >No Notes Available.. Create one.</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" border-border bg-notebar border-l-1 border-r-1 w-65 flex flex-col ">
      <SearchBar openModal={openModal} />
      <hr className="border-border" />
      {notes.map((note, index) => (
        <Notes
          onDeleteNote={onDeleteNote}
          onRenameNote={onRenameNote}
          key={index}
          note={note}
          index={index}
          onSelectedNote={onSelectedNote}
          isToolbarOpen={openToolbarIndex === index}
          onToggleToolbar={(e) => {
            e.stopPropagation();
            setOpenToolbarIndex(openToolbarIndex === index ? null : index);
          }}
        />
      ))}
    </div>
  );
}
