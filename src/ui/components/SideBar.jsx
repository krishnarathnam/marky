import Header from "./Header";
import Files from "./Files";
const SideBar = ({ username, onDeleteFolder, setLastWorked, openModal, setFolders, folders, lastWorked }) => {

  return (
    <aside className="min-h-screen w-55 bg-dark-blue text-sidebar-text m-0">
      <Header username={username} lastWorked={lastWorked} setLastWorked={setLastWorked} />
      <div className="flex flex-col h-full">
        <div className="overflow-y-auto flex-1">
          <Files onDeleteFolder={onDeleteFolder} openModal={openModal} setFolders={setFolders} folders={folders} />
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
