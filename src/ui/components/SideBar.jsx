import Header from "./Header";
import Files from "./Files";
import { useNavigate } from "react-router";
import { useTheme } from '../context/ThemeContext';

const SideBar = ({ folderNoteCounts, username, onDeleteFolder, setLastWorked, openModal, setFolders, folders, lastWorked }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  function handleHomeOnClick() {
    navigate('/')
  }

  return (
    <aside className={`min-h-screen w-50 ${isDarkMode ? '' : 'bg-dark-blue'} text-sidebar-text m-0`} style={isDarkMode ? { backgroundColor: '#151515' } : {}}>
      <div className="overflow-x-hidden text-ellipsis whitespace-nowrap max-w-full">
        <Header handleHomeOnClick={handleHomeOnClick} username={username} lastWorked={lastWorked} setLastWorked={setLastWorked} />
        <div className="flex flex-col h-full">
          <div className="overflow-y-auto flex-1">
            <Files folderNoteCounts={folderNoteCounts} onDeleteFolder={onDeleteFolder} openModal={openModal} setFolders={setFolders} folders={folders} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
