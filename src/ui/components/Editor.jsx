import React, { useEffect, useState } from "react";
import NotesBar from "./NotesBar";
import MarkDownEditor from "./MarkDownEditor";
import { AnimatePresence, motion } from 'motion/react'
import { useLocation, useParams } from "react-router-dom";
import MarkDownContainer from "./MarkDownContainer";

export default function Editor({ onCreateNewNote, handleExportPDF, linkFolderName, showNotesBar, getAllNotes, onToggleImportant, setAllNotes, onDeleteNote, onRenameNote, openModal, onSaveNote, notes, setLinkFolderName }) {

  const { LinkFolderName } = useParams();
  const [selectedNote, setSelectedNote] = useState('');

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/category/all' || location.pathname === '/category/recent') {
      getAllNotes();
    }
  }, [location]);

  useEffect(() => {
    setLinkFolderName(LinkFolderName);
  }, [LinkFolderName])


  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {showNotesBar && (
          <motion.div
            key="notesbar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <NotesBar
              onCreateNewNote={onCreateNewNote}
              handleExportPDF={handleExportPDF}
              linkFolderName={linkFolderName}
              showNotesBar={showNotesBar}
              onToggleImportant={onToggleImportant}
              notes={notes}
              onDeleteNote={onDeleteNote}
              onRenameNote={onRenameNote}
              openModal={openModal}
              onSelectedNote={setSelectedNote}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <MarkDownContainer onSaveNote={onSaveNote} selectedNote={selectedNote} />
      </motion.div>
    </div>
  );
}
