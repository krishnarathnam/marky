import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const handleWindow = (action) => {
  if (window.electron) {
    window.electron.send(`window-${action}`);
  }
};

const CustomTaskbar = () => (
  <div
    className="custom-taskbar border-b border-border sticky top-0 p-2 h-fit pr-4 bg-notebar flex items-center justify-between select-none"
    style={{
      WebkitAppRegion: 'drag',
    }}
  >
    <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
      <button className="bg-transparent border-none text-gray-400 hover:text-gray-600 cursor-pointer" tabIndex={-1}>
        <ChevronLeft size={18} />
      </button>
      <button className="bg-transparent border-none text-gray-400 hover:text-gray-600 cursor-pointer" tabIndex={-1}>
        <ChevronRight size={18} />
      </button>
    </div>
    <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
      <button
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        title="Close"
        onClick={() => handleWindow('close')}
      />
      <button
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
        title="Minimize"
        onClick={() => {handleWindow('minimize')
          console.log('minimized')}}
      />
      <button
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
        title="Maximize"
        onClick={() => {handleWindow('maximize') 
          console.log('maximized')}}
      />
    </div>
  </div>
);

export default CustomTaskbar;
