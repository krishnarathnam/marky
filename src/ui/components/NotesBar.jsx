import React, { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import SearchBar from "./SearchBar";
import CreateNoteModal from "./CreateNoteModal";
import Notes from "./Notes";
import { useTheme } from '../context/ThemeContext';

export default function NotesBar({ onCreateNewNote, handleExportPDF, linkFolderName, onToggleImportant, onRenameNote, onDeleteNote, notes, onSelectedNote }) {
  const [openToolbarIndex, setOpenToolbarIndex] = useState(null);
  const [sortedNotes, setSortedNotes] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [renameModal, setRenameModal] = useState(false);
  const [search, setSearch] = useState('');
  const [creatingNote, setCreatingNote] = useState(false);
  const [newNoteName, setNewNoteName] = useState('');
  const { isDarkMode } = useTheme();

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
      <div
        className="border-border border-l-1 border-r-1 w-65 flex flex-col"
        style={isDarkMode ? { backgroundColor: '#111111', borderColor: '#232323' } : {}}
      >
        <SearchBar
          search={search}
          onSearch={setSearch}
          linkFolderName={linkFolderName}
          onHandleSort={handleSort}
          openModal={isCreatingNewNote}
        />

        <hr className="border-border" style={isDarkMode ? { borderColor: '#232323' } : {}} />
        {creatingNote && (
          <CreateNoteModal setNewNoteName={setNewNoteName} handleNewNoteSubmit={handleNewNoteSubmit} />
        )}
        <div className="text-black font-bold text-sm justify-center">
          <p >No Notes Available.. Create one.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="border-border w-65 bg-notebar border-l-1 border-r-1 w-65 flex flex-col h-screen"
        style={isDarkMode ? { backgroundColor: '#111111', borderColor: '#232323' } : {}}
      >
        <div className="shrink-0">
          <SearchBar
            search={search}
            onSearch={setSearch}
            linkFolderName={linkFolderName}
            onHandleSort={handleSort}
            openModal={isCreatingNewNote}
          />
          <hr className="border-border" style={isDarkMode ? { borderColor: '#232323' } : {}} />
        </div>
        
          <div className="overflow-y-scroll flex-grow scrollbar-hidden">
          <LayoutGroup>
          {creatingNote && (
            <CreateNoteModal setNewNoteName={setNewNoteName} handleNewNoteSubmit={handleNewNoteSubmit} />
          )}
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.name}
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full "
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
                  onToggleToolbar={(indexToToggle) => {
                    setOpenToolbarIndex(prev => prev === indexToToggle ? null : indexToToggle);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          </LayoutGroup >
          </div>
        
      </div >
    </>
  );
}
