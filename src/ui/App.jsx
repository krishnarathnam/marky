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
  const [notes, setNotes] = useState([])
  const [noteName, setNoteName] = useState('')
  const [modalType, setModalType] = useState('folder');

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

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes...");
      const noteNames = await window.electron.getNotes(linkFolderName);
      const notesData = await Promise.all(
        noteNames.map(async (noteName) => {
          const { content, lastModified } = await window.electron.readNotes(linkFolderName, noteName);
          return {
            name: noteName,
            content: content,
            lastModified,
          };
        })
      );

      console.log('Loaded notes:', notesData);
      setNotes(notesData); // save {name, content} for each note
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNote = async (content, noteName) => {
    try {
      const response = await window.electron.saveNote(linkFolderName, noteName, content)
      if (response.success) {
        console.log(`Note "${noteName}" saved successfully!`);
      } else {
        console.error("Error saving note:", response.error);
      }
    } catch (error) {
      console.error('error saving file: ', error);

    }

  }
  async function createNewNote(name) {
    try {
      const response = await window.electron.createNote(linkFolderName, name);
      if (response.success) {
        fetchNotes();
        setModalOpen(false);
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert(`Error creating note: ${error.message}`);
    }
  }
  useEffect(() => {
    fetchNotes();
  }, [linkFolderName]);


  useEffect(() => {
    fetchFolders();
  }, []);


  function openModal(type) {
    setModalType(type)
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-white">
        {modalOpen &&
          <PromptFolder
            type={modalType} // Pass modal type ('folder' or 'note')
            setName={modalType === 'folder' ? setFolderName : setNoteName} // Set the appropriate state function for folder or note
            closeModal={closeModal}
            createItem={modalType === 'folder' ? createNewFolder : createNewNote} // Call the respective create function
          />
        }
        <SideBar onDeleteFolder={onDeleteFolder} openModal={openModal} setFolders={setFolders} folders={folders} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/category/:categoryName' element={<Home />} />
            <Route path='/folder/:LinkFolderName' element={<Editor openModal={openModal} onSaveNote={saveNote} notes={notes} setLinkFolderName={setLinkFolderName} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
