import React, { useEffect, useState } from "react";
import NotesBar from "./NotesBar";
import MarkDownEditor from "./MarkDownEditor";
import PromptModal from "./PromptFolder";
import { useLocation, useParams } from "react-router-dom";

export default function Editor({ setAllNotes, onDeleteNote, onRenameNote, openModal, onSaveNote, notes, setLinkFolderName }) {
  const { LinkFolderName } = useParams();
  const [selectedNote, setSelectedNote] = useState('');

  const location = useLocation();

  async function getAllNotes() {
    try {
      const response = await window.electron.getAllNotes();
      console.log(response);
      setAllNotes(response);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(`Error creating folder: ${error.message}`);
    }
  }
  useEffect(() => {
    if (location.pathname === '/category/all' || location.pathname === '/category/recent') {
      getAllNotes();
    }
  }, [location]);

  useEffect(() => {
    setLinkFolderName(LinkFolderName);
  }, [LinkFolderName])


  return (
    <div className="flex h-screen">
      <NotesBar notes={notes} onDeleteNote={onDeleteNote} onRenameNote={onRenameNote} openModal={openModal} onSelectedNote={setSelectedNote} />
      <div className="flex-1 overflow-y-auto ">
        <MarkDownEditor onSaveNote={onSaveNote} selectedNote={selectedNote} />
      </div>
    </div>
  );
}
