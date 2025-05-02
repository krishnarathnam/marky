import React, { useEffect, useState } from "react";
import NotesBar from "./NotesBar";
import MarkDownEditor from "./MarkDownEditor";
import PromptModal from "./PromptFolder";
import { useLocation, useParams } from "react-router-dom";

export default function Editor({ linkFolderName, showNotesBar, getAllNotes, onToggleImportant, setAllNotes, onDeleteNote, onRenameNote, openModal, onSaveNote, notes, setLinkFolderName }) {

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
      <div className="">
        <NotesBar
          linkFolderName={linkFolderName}
          showNotesBar={showNotesBar}
          onToggleImportant={onToggleImportant}
          notes={notes}
          onDeleteNote={onDeleteNote}
          onRenameNote={onRenameNote}
          openModal={openModal}
          onSelectedNote={setSelectedNote} />
      </div>
      <div className="flex-1 ">
        <MarkDownEditor onSaveNote={onSaveNote} selectedNote={selectedNote} />
      </div>
    </div>
  );
}
