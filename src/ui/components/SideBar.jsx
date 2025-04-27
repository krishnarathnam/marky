import Header from "./Header";
import Files from "./Files";
const SideBar = ({ onDeleteFolder, openModal, setFolders, folders }) => {

  return (
    <aside className="h-screen w-55 bg-off-white m-0">
      <Header />
      <div className="flex flex-col h-full">
        {/* Set the scrollable area for files */}
        <div className="overflow-y-auto flex-1">
          <Files openModal={openModal} setFolders={setFolders} folders={folders} />
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
