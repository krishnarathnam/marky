import React from 'react';
import { Edit, ArrowDownAZ } from 'lucide-react';

export default function SearchBar({ search, onSearch, linkFolderName, openModal, onHandleSort }) {
  return (
    <div className="m-2 mb-0.5" 
    style={{
      WebkitAppRegion: 'drag',
      userSelect: 'none',
    }}
    >
      <div className="h-5 w-full justify-between flex items-center" >
        <div style={{ WebkitAppRegion: 'no-drag' }}>
          <button onClick={onHandleSort} className="cursor-pointer" type="">
            <ArrowDownAZ size={20} className='text-note-primary' />
          </button>
        </div>
        <div>
          <h2 className='text-note-primary font-semibold'>All Notes</h2>
        </div>
        <div style={{ WebkitAppRegion: 'no-drag' }}>
        <button onClick={openModal} className="cursor-pointer"> {/* Open modal for creating note */}
          {linkFolderName && <Edit size={20} className='text-note-primary' />}
        </button>
        </div>
      </div>
      <div className="h-14 w-full flex items-center " style={{ WebkitAppRegion: 'no-drag' }}>
        <input
          type="text"
          value={search}
          placeholder="🔍 Search...."
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 p-1 rounded-md border border-[#d0cfcf] focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>
    </div>
  );
}
