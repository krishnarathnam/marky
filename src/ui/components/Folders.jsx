import React from 'react';
import SideBarFolder from './SideBarFolder';
import { Folder } from 'lucide-react';  // Assuming you're using react-icons for the Folder icon

export default function Folders({ onDeleteFolder, openModal, folders }) {

  return (
    <div>
      <h3 className="uppercase ml-3 font-bold  text-sm mb-2">
        <span>📂</span> Folders
      </h3>
      <div className="ml-6 space-y-2 max-h-[calc(100vh-500px)] overflow-y-auto">
        {folders.map((folder) => {
          return (
            <SideBarFolder
              to={`/folder/${folder.toLowerCase()}`}
              key={crypto.randomUUID()}
              icon={<Folder size={16} />}
              label={folder}
              onDeleteFolder={onDeleteFolder}
              folder={folder}
            />
          );
        })}
      </div>
      <button className="hover:font-bold  text-sm ml-6 mt-1" onClick={() => openModal('folder')}>+ new folder</button>
    </div>
  );
}
