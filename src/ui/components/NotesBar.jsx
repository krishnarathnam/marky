import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import Notes from "./Notes";

export default function NotesBar({ onToggleImportant, onRenameNote, onDeleteNote, openModal, notes, onSelectedNote }) {
  const [openToolbarIndex, setOpenToolbarIndex] = useState(null);
  const [sortedNotes, setSortedNotes] = useState([])
  const [isSorted, setIsSorted] = useState(false)
  const [renameModal, setRenameModal] = useState(false)
  const [showScrollbar, setShowScrollbar] = useState(true);
  const timeoutRef = useRef(null);

  const handleUserActivity = () => {
    setShowScrollbar(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowScrollbar(false);
    }, 600);
  };

  function openModalRename() {
    setRenameModal(true)
  }

  function closeModalRename() {
    setRenameModal(false)
  }
  function handleSort() {
    setIsSorted(!isSorted);
  }

  useEffect(() => {
    setSortedNotes([...notes].sort((a, b) => a.name.localeCompare(b.name)));
  }, [notes])

  useEffect(() => {
    const handleClick = () => {
      setOpenToolbarIndex(null);
      closeModalRename();
    }
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
    <div className="border-border bg-notebar border-l-1 border-r-1 w-65 flex flex-col h-screen">
      {/* SearchBar at the top */}
      <div className="shrink-0">
        <SearchBar onHandleSort={handleSort} openModal={openModal} />
        <hr className="border-border" />
      </div>

      {/* Scrollable notes section */}
      <div
        className={`flex-1 overflow-y-scroll transition-opacity duration-300 ${showScrollbar ? "scrollbar-visible" : "scrollbar-hidden"
          }`}
        onMouseMove={handleUserActivity}
        onScroll={handleUserActivity}
      >
        {(isSorted ? sortedNotes : notes).map((note, index) => (
          <Notes
            onToggleImportant={onToggleImportant}
            onDeleteNote={onDeleteNote}
            onRenameNote={onRenameNote}
            key={index}
            note={note}
            openModal={openModalRename}
            closeModal={closeModalRename}
            renameModal={renameModal}
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
    </div>
  );
}
