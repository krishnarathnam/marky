import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import Notes from "./Notes";

export default function NotesBar({ handleExportPDF, linkFolderName, onToggleImportant, onRenameNote, onDeleteNote, openModal, notes, onSelectedNote }) {
  const [openToolbarIndex, setOpenToolbarIndex] = useState(null);
  const [sortedNotes, setSortedNotes] = useState([])
  const [isSorted, setIsSorted] = useState(false)
  const [renameModal, setRenameModal] = useState(false)
  const [search, setSearch] = useState('');

  const filteredNotes = (isSorted ? sortedNotes : notes).filter(note =>
    note.name.toLowerCase().includes(search.toLowerCase())
  );



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
        <SearchBar
          search={search}
          onSearch={setSearch}
          linkFolderName={linkFolderName}
          onHandleSort={handleSort}
          openModal={openModal}
        />

        <hr className="border-border" />
        <div className="text-black font-bold text-sm justify-center">
          <p >No Notes Available.. Create one.</p>
        </div>
      </div>
    )
  }


  return (
    <div className="border-border w-65 bg-notebar border-l-1 border-r-1 w-65 flex flex-col h-screen">
      <div className="shrink-0">
        <SearchBar
          search={search}
          onSearch={setSearch}
          linkFolderName={linkFolderName}
          onHandleSort={handleSort}
          openModal={openModal}
        />
        <hr className="border-border" />
      </div>

      <div
        className={`flex-1 overflow-y-scroll transition-opacity duration-300 scrollbar-hidden`}
      >
        {filteredNotes.map((note, index) => (
          <Notes
            handleExportPDF={handleExportPDF}
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
  )
}

