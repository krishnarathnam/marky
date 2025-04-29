import React from 'react';
import { Edit, ArrowDownAZ } from 'lucide-react';

export default function SearchBar({ openModal }) {
  return (
    <div className="m-2">
      <div className="h-5 w-full justify-between flex items-center">
        <ArrowDownAZ size={20} />
        <h2>All Notes</h2>
        <button onClick={() => openModal('note')}> {/* Open modal for creating note */}
          <Edit size={20} />
        </button>
      </div>
      <div className="h-14 w-full flex items-center border-b border-[#d0cfcf]">
        <input
          type="text"
          placeholder="Search...."
          className="flex-1 p-1 rounded-md border border-[#d0cfcf] focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>
    </div>
  );
}
