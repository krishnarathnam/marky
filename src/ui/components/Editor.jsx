import React, { useEffect, useState } from "react";
import NotesBar from "./NotesBar";
import { AnimatePresence, motion } from 'motion/react'
import { useParams } from "react-router-dom";
import MarkDownContainer from "./MarkDownContainer";
import CustomTaskbar from './CustomTaskbar.jsx'

export default function Editor({ onCreateNewNote, handleExportPDF, linkFolderName, showNotesBar, getAllNotes, onToggleImportant, setAllNotes, onDeleteNote, onRenameNote, openModal, onSaveNote, notes, setLinkFolderName }) {

  const { LinkFolderName } = useParams();
  const [selectedNote, setSelectedNote] = useState('');

  useEffect(() => {
    setLinkFolderName(LinkFolderName);
  }, [LinkFolderName, setLinkFolderName])


  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {showNotesBar && (
            <motion.div
              key="notesbar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 "
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

      <div className="flex-1 flex flex-col overflow-hidden">
          <div className="sticky top-0 z-10 flex-shrink-0">
            <CustomTaskbar />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              <MarkDownContainer onSaveNote={onSaveNote} selectedNote={selectedNote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
