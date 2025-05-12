import React, { useState } from 'react';
import SideBarFolder from './SideBarFolder';
import { Folder } from 'lucide-react';  // Assuming you're using react-icons for the Folder icon
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function Folders({ folderNoteCounts, onDeleteFolder, openModal, folders }) {
  const [showFolders, setShowFolders] = useState(true);
  const [noteCount, setNoteCount] = useState(0);


  function handleHideFolders() {
    setShowFolders(!showFolders)
  }


  return (
    <div>
      <div onClick={handleHideFolders} className='select-none flex ml-3'>
        {!showFolders ? <ChevronRight strokeWidth={3} size={18} className='mt-0.5' /> : <ChevronDown strokeWidth={3} size={18} className='mt-0.5' />}
        <h3 className="uppercase font-bold  text-sm mb-2">
          <span>📂</span> Folders
        </h3>
      </div>
      {showFolders && (
        <>

          <div className="ml-8 space-y-2  ">
            {folders.map((folder) => {
              const count = folderNoteCounts?.[folder] || 0;
              return (
                <SideBarFolder
                  to={`/folder/${folder.toLowerCase()}`}
                  key={crypto.randomUUID()}
                  icon={<Folder size={18} />}
                  label={folder}
                  onDeleteFolder={onDeleteFolder}
                  folder={folder}
                  count={count}
                />
              );
            })}
          </div>
          <div className="ml-2 space-y-2 ">
            <button className="hover:font-bold  text-sm ml-6 mt-1" onClick={() => openModal('folder')}>+ new folder</button>
          </div>
        </>
      )}
    </div>
  );
}
