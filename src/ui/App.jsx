import React, { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import PromptFolder from "./components/PromptFolder";
import Home from "./components/Home";
import Editor from "./components/Editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('Default');
  const [linkFolderName, setLinkFolderName] = useState('')
  async function createNewFolder() {
    try {
      const response = await window.electron.createSubfolder(folderName);
      if (response.success) {
        // Refresh folders after creating a new one
        fetchFolders();
        setModalOpen(false)
        console.log(folders)
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(`Error creating folder: ${error.message}`);
    }
  }

  async function onDeleteFolder(folderName) {
    // Call the Electron delete API
    console.log("Deleting folder:", folderName);  // Log the folderName to see if it's correct
    try {
      const response = await window.electron.deleteFolder(folderName);
      if (response.success) {
        alert(`Folder "${folderName}" deleted.`);
        fetchFolders(); // Refresh the folder list after deletion
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchFolders = async () => {
    try {
      console.log("Fetching folders...");
      const response = await window.electron.getFolders();
      setFolders(response);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-white">
        {modalOpen && <PromptFolder setFolderName={setFolderName} closeModal={closeModal} createNewFolder={createNewFolder} />}
        <SideBar onDeleteFolder={onDeleteFolder} openModal={openModal} setFolders={setFolders} folders={folders} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/category/:categoryName' element={<Home />} />
            <Route path='/folder/:LinkFolderName' element={<Editor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
