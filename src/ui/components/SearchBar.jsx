import React from 'react';
import { Edit, ArrowDownAZ } from 'lucide-react';

export default function SearchBar({ search, onSearch, linkFolderName, openModal, onHandleSort }) {
  return (
    <div className="m-2 mb-0.5">
      <div className="h-5 w-full justify-between flex items-center">
        <button onClick={onHandleSort} type="">
          <ArrowDownAZ size={20} className='text-note-primary' />
        </button>
        <h2 className='text-note-primary font-semibold'>All Notes</h2>
        <button onClick={openModal}> {/* Open modal for creating note */}
          {linkFolderName && <Edit size={20} className='text-note-primary' />}
        </button>
      </div>
      <div className="h-14 w-full flex items-center ">
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
