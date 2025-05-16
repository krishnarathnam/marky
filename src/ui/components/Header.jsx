import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ handleHomeOnClick, username, setLastWorked, lastWorked }) {
  const [showSettings, setShowSettings] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem("lastWorked");
    if (saved) setLastWorked(new Date(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (lastWorked) {
      localStorage.setItem("lastWorked", lastWorked.toISOString());
    }
  }, [lastWorked]);

  const formattedTime = (() => {
    if (!lastWorked) return "No activity yet";

    const now = new Date();
    const last = new Date(lastWorked);

    const isSameDay =
      now.getFullYear() === last.getFullYear() &&
      now.getMonth() === last.getMonth() &&
      now.getDate() === last.getDate();

    return isSameDay
      ? last.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // e.g., 2:30 PM
      : last.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); // e.g., Apr 30, 2025
  })();

  return (
    <>
      <div className={`rounded-b-sm shadow-2xs flex flex-col mb-5 ${isDarkMode ? '' : 'bg-darker-blue'}`} style={isDarkMode ? { backgroundColor: '#181A1B' } : {}}>
        <div className="flex justify-between items-center p-3 pb-5 mt-2">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            <h3 onClick={handleHomeOnClick} className="font-bold text-m dark:text-white">
              {username}
            </h3>
            <p className="text-xs dark:text-gray-300">Last worked at {formattedTime}</p>
          </div>
          <button onClick={() => setShowSettings(true)}>
            <Settings size={18} className="cursor-pointer hover:text-gray-300 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

