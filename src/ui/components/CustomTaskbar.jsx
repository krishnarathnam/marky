import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const handleWindow = (action) => {
  if (window.electron) {
    window.electron.send(`window-${action}`);
  }
};

const CustomTaskbar = () => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className="custom-taskbar border-b border-border sticky top-0 p-2 h-fit pr-4 flex items-center justify-between select-none"
      style={{
        WebkitAppRegion: 'drag',
        background: isDarkMode ? '#0D0D0D' : '',
        borderColor: isDarkMode ? '#232323' : '',
      }}
    >
      <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button className="bg-transparent border-none cursor-pointer" tabIndex={-1}>
          <ChevronLeft size={18} color={isDarkMode ? '#fff' : '#9ca3af'} />
        </button>
        <button className="bg-transparent border-none cursor-pointer" tabIndex={-1}>
          <ChevronRight size={18} color={isDarkMode ? '#fff' : '#9ca3af'} />
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
};

export default CustomTaskbar;
