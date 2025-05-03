import { Settings } from 'lucide-react'
import { useEffect } from 'react';

export default function Header({ handleHomeOnClick, username, setLastWorked, lastWorked }) {

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
    <div className="bg-darker-blue rounded-b-sm shadow-2xs flex flex-col mb-5">
      <div className="flex justify-between items-center p-3 pb-5 mt-2">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
          <h3 onClick={handleHomeOnClick} className="font-bold text-m">
            {username}
          </h3>
          <p className="text-xs">Last worked at {formattedTime}</p>
        </div>
        <Settings size={18} className="" />
      </div>
    </div>
  );
}

