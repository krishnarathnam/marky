import Header from "./Header";
import Files from "./Files";
import { useNavigate } from "react-router";
const SideBar = ({ folderNoteCounts, username, onDeleteFolder, setLastWorked, openModal, setFolders, folders, lastWorked }) => {

  const navigate = useNavigate();

  function handleHomeOnClick() {
    navigate('/')
  }

  return (
    <aside className="min-h-screen w-50 bg-dark-blue text-sidebar-text m-0">
      <div className="overflow-x-hidden text-ellipsis whitespace-nowrap max-w-full">
        {/**/}<Header handleHomeOnClick={handleHomeOnClick} username={username} lastWorked={lastWorked} setLastWorked={setLastWorked} />
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
