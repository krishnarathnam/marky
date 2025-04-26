import React, { useState } from "react";
import SideBar from "./components/SideBar";
import PromptFolder from "./components/PromptFolder";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [folders, setFolders] = useState(['Cse', 'College'])
  const [folderName, setFolderName] = useState('Default')

  function createNewFolder() {
    setFolders([...folders, folderName])
    setFolderName('default')
    setModalOpen(false)
  }

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-neutral-900">

        {modalOpen && <PromptFolder setFolderName={setFolderName} closeModal={closeModal} createNewFolder={createNewFolder} />}
        <SideBar openModal={openModal} setFolders={setFolders} folders={folders} />
        {/* <NotesBar /> */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/category/:name' element={<Home />} />
            <Route path='/folder/:name' element={<div>welcome to folder</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
// bg-[#F9F6EE]
