import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Notes from "./Notes";

export default function NotesBar({ onCreateNewNote, handleExportPDF, linkFolderName, onToggleImportant, onRenameNote, onDeleteNote, openModal, notes, onSelectedNote }) {
  const [openToolbarIndex, setOpenToolbarIndex] = useState(null);
  const [sortedNotes, setSortedNotes] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [search, setSearch] = useState('');
  const [creatingNote, setCreatingNote] = useState(false);
  const [newNoteName, setNewNoteName] = useState('');

  const notesToRender = isSorted ? sortedNotes : notes;
  const filteredNotes = notesToRender.filter(note =>
    note.name.toLowerCase().includes(search.toLowerCase())
  );

  function openModalRename() {
    setRenameModal(true);
  }

  function closeModalRename() {
    setRenameModal(false);
  }
  function handleSort() {
    setIsSorted(!isSorted);
  }

  function getNowTime() {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    return formatted;
  }

  function isCreatingNewNote() {
    setCreatingNote(true);
  }

  function handleNewNoteCancel() {
    setNewNoteName('');
    setCreatingNote(false);
  }

  function handleNewNoteSubmit(e) {
    if (e) e.preventDefault();
    onCreateNewNote(newNoteName);
    setNewNoteName('');
    setCreatingNote(false);
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && creatingNote) {
        handleNewNoteCancel();
      } else if (e.key === 'Enter' && creatingNote) {
        handleNewNoteSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [creatingNote, newNoteName]);

  useEffect(() => {
    setSortedNotes([...notes].sort((a, b) => a.name.localeCompare(b.name)));
  }, [notes]);

  useEffect(() => {
    const handleClick = () => {
      setOpenToolbarIndex(null);
      closeModalRename();
    };
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
          openModal={isCreatingNewNote}
        />

        <hr className="border-border" />
        <div className="text-black font-bold text-sm justify-center">
          <p >No Notes Available.. Create one.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-border w-65 bg-notebar border-l-1 border-r-1 w-65 flex flex-col h-screen">
        <div className="shrink-0">
          <SearchBar
            search={search}
            onSearch={setSearch}
            linkFolderName={linkFolderName}
            onHandleSort={handleSort}
            openModal={isCreatingNewNote}
          />
          <hr className="border-border" />
        </div>
        <AnimatePresence>
          {creatingNote && (
            <motion.form
              onSubmit={handleNewNoteSubmit}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              layout // allows layout animation
            >
              <div className="border-border p-2 border-b-1">
                <div className="text-xs flex justify-between text-note-teriary mb-2">
                  <div>Created at: {getNowTime()}</div>
                </div>
                <div className="text-base mb-3 font-semibold text-note-primary">
                  <input
                    type="text"
                    onChange={(e) => setNewNoteName(e.target.value)}
                    className="border-border border-1 rounded-sm"
                    autoFocus
                  />
                </div>
                <div className="text-sm text-note-secondary pt-1.5 truncate"></div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className={`flex-1 overflow-y-scroll transition-opacity duration-300 scrollbar-hidden`}>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.name}
                layout // <-- Enables layout transition
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }} // smoother transition
              >
                <Notes
                  handleExportPDF={handleExportPDF}
                  onToggleImportant={onToggleImportant}
                  onDeleteNote={onDeleteNote}
                  onRenameNote={onRenameNote}
                  key={note.name}
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
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div >
    </>
  );
}
