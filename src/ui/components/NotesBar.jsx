import React from "react";
import SearchBar from "./SearchBar";
import Notes from "./Notes";

export default function NotesBar() {
  return (
    <div className="bg-gray-50 border-[#d0cfcf] border-l-1 border-r-1 w-65 flex flex-col max-h-screen">
      <SearchBar />
      <div className="overflow-y-auto mt-1">
        <Notes />
        <Notes />
        <Notes />
        <Notes />
        <Notes />
        <Notes />
        <Notes />
        <Notes />
        <Notes />
      </div>

    </div>
  );
}
