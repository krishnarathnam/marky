import React from 'react';
import {useState} from 'react';
import SideBarLink from './SideBarLink';
import { Folder } from 'lucide-react';  // Assuming you're using react-icons for the Folder icon

export default function Folders() {
	const [folders, setFolders] = useState(['Cse', 'College'])

	  function createNewFolder(){
	  	setFolders([...folders, 'newFolder'])
	  }

	  return (
	    <div>
	      <h3 className="uppercase ml-3 font-bold text-dim-gray text-sm mb-2">
	        <span>📂</span> Folders
	      </h3>
	      <div className="ml-6 space-y-2 max-h-[calc(100vh-500px)] overflow-y-auto">
	        {folders.map((folder) => {
	          return (
	            <SideBarLink
	              to={`/folder/${folder.toLowerCase()}`}
	              key={crypto.randomUUID()}
	              icon={<Folder size={16} />}
	              label={folder}
	            />
	          );
	        })}
	      </div>
	      <button className="hover:font-bold text-dim-gray text-sm ml-6 mt-1" onClick={createNewFolder}>+ new folder</button>
	    </div>
	  );
}