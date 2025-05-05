import { useEffect, useState } from "react";


export default function MarkDownHeader({ selectedNote }) {
  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (!selectedNote) {
      setNewName('Select a Note');
    } else {
      setNewName(selectedNote.name.replace(/\.md$/, '').toUpperCase());
    }
  }, [selectedNote]);

  return (
    <div className="h-30">
      <div className="flex h-full text-5xl ">
        <div>
          <input
            type="text"
            onChange={(e) => setNewName(e.target.value)}
            value={newName || ''} />
        </div>
      </div>
    </div>
  )
}

