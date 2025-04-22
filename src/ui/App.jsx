import React from "react";
import SideBar from "./components/SideBar";
import NotesBar from "./components/NotesBar";

function App() {
  return (
    <div className="flex h-screen bg-neutral-900">
      <SideBar>
        <button>important</button>
      </SideBar>
      <NotesBar />
    </div>
  );
}

export default App;
// bg-[#F9F6EE]
