import React, { useEffect, useState } from "react";
import NotesBar from "./NotesBar";
import MarkDownEditor from "./MarkDownEditor";
import PromptModal from "./PromptFolder";
import { useParams } from "react-router-dom";

export default function Editor({ openModal, onSaveNote, notes, setLinkFolderName }) {
  const { LinkFolderName } = useParams();
  const [selectedNote, setSelectedNote] = useState('');

  useEffect(() => {
    setLinkFolderName(LinkFolderName);
  }, [LinkFolderName])

  return (
    <div className="flex h-screen">
      <NotesBar notes={notes} openModal={openModal} onSelectedNote={setSelectedNote} />
      <div className="flex-1 overflow-y-auto ">
        <MarkDownEditor onSaveNote={onSaveNote} selectedNote={selectedNote} />
        {/*<ReactMarkdown />*/}
        {/*<SimpleMde />*/}
      </div>
    </div>
  );
}
