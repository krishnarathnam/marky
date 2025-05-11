import React, { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import SideBar from "./components/SideBar";
import PromptFolder from "./components/PromptFolder";
import Home from "./components/Home";
import Editor from "./components/Editor";
import { Routes, Route, HashRouter } from "react-router-dom";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("Default");
  const [linkFolderName, setLinkFolderName] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteName, setNoteName] = useState("");
  const [modalType, setModalType] = useState("folder");
  const [allNotes, setAllNotes] = useState([]);
  const [lastWorked, setLastWorked] = useState(null);
  const [username, setUsername] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNotesBar, setShowNotesBar] = useState(true);
  const [folderNoteCounts, setFoulderNoteCounts] = useState(0);

  const importantNotes = (allNotes || []).filter((note) => note.isImportant);

  const recentNotes = [...allNotes].sort((a, b) => {
    const aDate = new Date(a.lastModified);
    const bDate = new Date(b.lastModified);
    return bDate - aDate;
  });

  function handleFoulderNoteCount() {
    setFoulderNoteCounts(folders.reduce((acc, folder) => {
      acc[folder] = allNotes.filter(note => note.folderName === folder).length;
      return acc;
    }, {}))
  }

  async function createNewFolder() {
    try {
      const response = await window.electron.createSubfolder(folderName);
      if (response.success) {
        fetchFolders();
        setModalOpen(false);
        console.log(folders);
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(`Error creating folder: ${error.message}`);
    }
  }

  async function getAllNotes() {
    try {
      const response = await window.electron.getAllNotes();
      setAllNotes(response);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert(`Error creating folder: ${error.message}`);
    }
  }

  async function toggleImportant(folderName, noteName, value) {
    const updatedNotes = allNotes.map((n) => {
      if (n.folderName === folderName && n.name === noteName) {
        return { ...n, isImportant: value };
      }
      return n;
    });
    setAllNotes(updatedNotes); // Optimistically update allNotes

    fetchNotes();
    try {
      const response = await window.electron.toggleImportant(folderName, noteName, value);
      if (response.success) {
        await getAllNotes();
      } else {
        alert(`Failed to update importance: ${response.error}`);
        await getAllNotes();
      }
    } catch (error) {
      console.error("Error toggling important flag:", error);
      await getAllNotes(); // Revert on error
    }
  }

  function handleExportPDF({ content, fileName }) {
    window.electron.exportToPDF({ content, fileName });
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
      const response = await window.electron.getFolders();
      setFolders(response);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  async function fetchNotes() {
    try {
      const noteNames = await window.electron.getNotes(linkFolderName);
      const notesData = await Promise.all(
        noteNames.map(async (noteName) => {
          const { content, lastModified, isImportant } =
            await window.electron.readNotes(linkFolderName, noteName);

          return {
            name: noteName,
            content: content,
            folderName: linkFolderName,
            lastModified,
            isImportant,
          };
        })
      );

      notesData.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))

      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const saveNote = async (folderName, content, noteName) => {
    try {
      const response = await window.electron.saveNote(folderName, noteName, content);
      if (response.success) {
        console.log(`Note "${noteName}" saved successfully!`);
        setLastWorked(new Date());

        // Update notes state to reflect new content
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.name === noteName && note.folderName === folderName
              ? { ...note, content }
              : note
          )
        );
      } else {
        console.error("Error saving note:", response.error);
      }
    } catch (error) {
      console.error("error saving file: ", error);
    }
  };

  async function createNewNote(name) {
    try {
      const response = await window.electron.createNote(linkFolderName, name);
      if (response.success) {
        fetchNotes();
        setModalOpen(false);
        handleFoulderNoteCount();
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
        handleFoulderNoteCount();
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

  const handleUsernameSubmit = async (event) => {
    event.preventDefault();
    if (username.trim()) {
      const response = await window.electron.saveUsername(username);
      if (response.success) {
        setShowPrompt(false);
        setAppReady(true);
        console.log("Username saved:", username);
      } else {
        alert("Failed to save username.");
      }
    } else {
      alert("Please enter a username.");
    }
  };

  useEffect(() => {
    window.electron.ipcRenderer.on("show-username-prompt", () => {
      setShowPrompt(true);
    });

    const getSavedUsername = async () => {
      const savedUsername = await window.electron.getUsername();
      if (savedUsername) {
        setUsername(savedUsername);
        setAppReady(true);
      } else {
        setShowPrompt(true);
        setAppReady(false);
      }
    };

    getSavedUsername();

    return () => {
      window.electron.ipcRenderer.removeAllListeners("show-username-prompt");
    };
  }, []);

  useEffect(() => {
    getAllNotes();
  }, [])

  useEffect(() => {
    handleFoulderNoteCount();
  }, [folders, allNotes])

  useEffect(() => {
    if (linkFolderName === undefined) {
      getAllNotes();
    } else {
      fetchNotes(linkFolderName);
    }
  }, [linkFolderName]);

  useEffect(() => {
    fetchFolders();
  }, []);


  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.key === 'b') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }

      if (ctrlOrCmd && e.key === 'n') {
        e.preventDefault();
        setShowNotesBar(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function openModal(type) {
    setModalType(type);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  if (showPrompt) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome to Marky!</h2>
          <form onSubmit={handleUsernameSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Your Name:
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Name
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!appReady) {
    return <div>Loading...</div>;
  }

  return (
    <HashRouter>
      <LayoutGroup>
        <div className="flex h-screen">
          {modalOpen && (
            <PromptFolder
              type={modalType}
              setName={modalType === "folder" ? setFolderName : setNoteName}
              closeModal={closeModal}
              createItem={modalType === "folder" ? createNewFolder : createNewNote}
            />
          )}

          <div className="flex flex-row h-full w-full">
            <AnimatePresence mode="wait">
              {showSidebar && (
                <motion.div
                  key="sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <SideBar
                    lastWorked={lastWorked}
                    username={username}
                    setLastWorked={setLastWorked}
                    onDeleteFolder={onDeleteFolder}
                    openModal={openModal}
                    setFolders={setFolders}
                    folders={folders}
                    folderNoteCounts={folderNoteCounts}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.main
              layout
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-y-auto"
            >
              <Routes>
                <Route path="/" element={<Home username={username} />} />
                <Route
                  path="/category/important"
                  element={
                    <Editor
                      handleExportPDF={handleExportPDF}
                      onCreateNewNote={createNewNote}
                      showNotesBar={showNotesBar}
                      linkFolderName={linkFolderName}
                      getAllNotes={getAllNotes}
                      setAllNotes={setAllNotes}
                      onRenameNote={renameNote}
                      onDeleteNote={deleteNote}
                      openModal={openModal}
                      notes={importantNotes}
                      onSaveNote={saveNote}
                      onToggleImportant={toggleImportant}
                      setLinkFolderName={setLinkFolderName}
                    />
                  }
                />
                <Route
                  path="/category/recent"
                  element={
                    <Editor
                      handleExportPDF={handleExportPDF}
                      onCreateNewNote={createNewNote}
                      getAllNotes={getAllNotes}
                      linkFolderName={linkFolderName}
                      showNotesBar={showNotesBar}
                      setAllNotes={setAllNotes}
                      onRenameNote={renameNote}
                      onDeleteNote={deleteNote}
                      openModal={openModal}
                      notes={recentNotes}
                      onSaveNote={saveNote}
                      onToggleImportant={toggleImportant}
                      setLinkFolderName={setLinkFolderName}
                    />
                  }
                />
                <Route
                  path="/category/all"
                  element={
                    <Editor
                      handleExportPDF={handleExportPDF}
                      onCreateNewNote={createNewNote}
                      getAllNotes={getAllNotes}
                      linkFolderName={linkFolderName}
                      showNotesBar={showNotesBar}
                      setAllNotes={setAllNotes}
                      onRenameNote={renameNote}
                      onDeleteNote={deleteNote}
                      openModal={openModal}
                      notes={allNotes}
                      onSaveNote={saveNote}
                      setLinkFolderName={setLinkFolderName}
                      onToggleImportant={toggleImportant}
                    />
                  }
                />
                <Route
                  path="/folder/:LinkFolderName"
                  element={
                    <Editor
                      handleExportPDF={handleExportPDF}
                      onCreateNewNote={createNewNote}
                      getAllNotes={getAllNotes}
                      linkFolderName={linkFolderName}
                      onRenameNote={renameNote}
                      onDeleteNote={deleteNote}
                      showNotesBar={showNotesBar}
                      openModal={openModal}
                      onSaveNote={saveNote}
                      notes={notes}
                      setLinkFolderName={setLinkFolderName}
                      currentFolerName={linkFolderName}
                      onToggleImportant={toggleImportant}
                    />
                  }
                />
              </Routes>
            </motion.main>
          </div>
        </div>
      </LayoutGroup>
    </HashRouter>
  );
}
export default App;
