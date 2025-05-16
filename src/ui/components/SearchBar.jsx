import React from 'react';
import { Edit, ArrowDownAZ } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({ search, onSearch, linkFolderName, openModal, onHandleSort }) {
  const { isDarkMode } = useTheme();
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
            <ArrowDownAZ size={20} className={isDarkMode ? 'text-gray-200' : 'text-note-primary'} />
          </button>
        </div>
        <div>
          <h2 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-note-primary'}`}>All Notes</h2>
        </div>
        <div style={{ WebkitAppRegion: 'no-drag' }}>
        <button onClick={openModal} className="cursor-pointer"> {/* Open modal for creating note */}
          {linkFolderName && <Edit size={20} className={isDarkMode ? 'text-gray-200' : 'text-note-primary'} />}
        </button>
        </div>
      </div>
      <div className="h-14 w-full flex items-center " style={{ WebkitAppRegion: 'no-drag' }}>
        <input
          type="text"
          value={search}
          placeholder="🔍 Search...."
          onChange={(e) => onSearch(e.target.value)}
          className={`flex-1 p-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-amber-300 ${isDarkMode ? 'bg-[#181A1B] text-gray-100 border-[#232323] placeholder-gray-500' : 'border-[#d0cfcf]'}`}
        />
      </div>
    </div>
  );
}
