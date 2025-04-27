import React from 'react';
import { Search, Edit, ArrowDownAZ } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="m-2">
      <div className="h-5 w-full justify-between flex items-center ">
        <ArrowDownAZ />
        <h2>All Notes</h2>
        <Edit />
      </div>
      <div className="h-14 w-full flex items-center border-b border-[#d0cfcf]">
        <input
          type="text"
          placeholder="  Search...."
          className="flex-1 p-1 rounded-md border border-[#d0cfcf] focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>
    </div>
  );
}
