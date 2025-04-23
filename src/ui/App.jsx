import React from "react";
import SideBar from "./components/SideBar";
import NotesBar from "./components/NotesBar";
import Notes from "./components/Notes";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
    <div className="flex h-screen bg-neutral-900">
      <SideBar/>
      {/* <NotesBar /> */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path='/allnotes' element={<Home />}/>
          <Route path='/pnotes' element={<Notes />}/>
        </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
}

export default App;
// bg-[#F9F6EE]
