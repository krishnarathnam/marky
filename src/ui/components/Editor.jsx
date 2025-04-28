import React from "react";
import NotesBar from "./NotesBar";
import MarkDownEditor from "./MarkDownEditor";
import ReactMarkdown from './ReactMarkdown';
import SimpleMde from "./SimpleMDE";
import { useParams } from "react-router-dom";

export default function Editor() {
  const { LinkFolderName } = useParams();

  return (
    <div className="flex h-screen">
      <NotesBar />
      <div className="flex-1 overflow-y-auto ">
        <MarkDownEditor />
        {/*<ReactMarkdown />*/}
        {/*<SimpleMde />*/}
      </div>
    </div>
  );
}
