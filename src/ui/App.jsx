import React, { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import PromptFolder from "./components/PromptFolder";
import Home from "./components/Home";
import Editor from "./components/Editor";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('Default');
  const [linkFolderName, setLinkFolderName] = useState('')
  const [notes, setNotes] = useState([])
  const [noteName, setNoteName] = useState('')
  const [modalType, setModalType] = useState('folder');
  const [allNotes, setAllNotes] = useState([]);

<<<<<<< HEAD
  const recentNotes = [...allNotes].sort((a, b) => {
    const aDate = new Date(a.lastModified);
    const bDate = new Date(b.lastModified);

    return bDate - aDate;
  });
=======
  const recentNotes = [...allNotes]
    .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
    .map(note => ({
      ...note,
      formattedDate: new Date(note.lastModified).toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', ''),
    }));
>>>>>>> 6f5e63c99204b1f16c444ad8c4df16ef559ae988
  async function createNewFolder() {
    try {
      const response = await window.electron.createSubfolder(folderName);
      if (response.success) {
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
    console.log("Deleting folder:", folderName);
    try {
      const response = await window.electron.deleteFolder(folderName);
      if (response.success) {
        alert(`Folder "${folderName}" deleted.`);
        fetchFolders();
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
      setNotes(notesData);
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

  async function deleteNote(noteName) {
    try {
      const response = await window.electron.deleteNote(linkFolderName, noteName);
      if (response.success) {
        fetchNotes();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert(`Error deleting note: ${error.message}`);
    }
  }

  async function renameNote(noteName, newNoteName) {
    try {
      const response = await window.electron.renameNote(linkFolderName, noteName, newNoteName);
      if (response.success) {
        fetchNotes();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert(`Error deleting note: ${error.message}`);
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


  console.log('all notes', allNotes)
  console.log('recent notes', recentNotes)


  return (
    <BrowserRouter>
      <div className="flex h-screen">
        {modalOpen &&
          <PromptFolder
            type={modalType}
            setName={modalType === 'folder' ? setFolderName : setNoteName}
            closeModal={closeModal}
            createItem={modalType === 'folder' ? createNewFolder : createNewNote}
          />
        }
        <SideBar onDeleteFolder={onDeleteFolder} openModal={openModal} setFolders={setFolders} folders={folders} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/category/recent' element={<Editor setAllNotes={setAllNotes} onRenameNote={renameNote} onDeleteNote={deleteNote} openModal={openModal} notes={recentNotes} onSaveNote={saveNote} setLinkFolderName={setLinkFolderName} />} />
            <Route path='/category/all' element={<Editor setAllNotes={setAllNotes} onRenameNote={renameNote} onDeleteNote={deleteNote} openModal={openModal} notes={allNotes} onSaveNote={saveNote} setLinkFolderName={setLinkFolderName} />} />
            <Route path='/folder/:LinkFolderName' element={<Editor onRenameNote={renameNote} onDeleteNote={deleteNote} openModal={openModal} onSaveNote={saveNote} notes={notes} setLinkFolderName={setLinkFolderName} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
