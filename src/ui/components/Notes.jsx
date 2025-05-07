import { Ellipsis, X, Trash2, FileDown, Star, FolderPen } from 'lucide-react';
import { useState } from 'react';

export default function Notes({
  handleExportPDF,
  renameModal,
  closeModal,
  openModal,
  onToggleImportant,
  onRenameNote,
  onDeleteNote,
  note,
  onSelectedNote,
  isToolbarOpen,
  onToggleToolbar,
  index
}) {
  const [renameName, setRenameName] = useState('Default');

  function HandleRename() {
    const safeNewName = renameName.endsWith('.md') ? renameName : `${renameName}.md`;
    onRenameNote(note.name, safeNewName);
    closeModal();
    onToggleToolbar(null); // Close toolbar
  }

  function stripMarkdown(text) {
    return text
      .replace(/[#_*`>~-]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^\s*>+/gm, '')
      .replace(/^\s*([-*]|\d+\.)\s+/gm, '')
      .trim();
  }

  return (
    <div
      className="relative p-2 flex flex-col w-full hover:bg-gray-200 transition border-border border-b-1"
      onClick={() => onSelectedNote(note)}
    >
      <div>
        <div className="text-xs flex justify-between ext-blue-950 text-note-teriary mb-2">
          <div>Last modified: {note.lastModified}</div>
          <button className="text-gray-700" onClick={(e) => {
            e.stopPropagation();
            onToggleToolbar(index); // Toggle toolbar with index
          }}>
            <Ellipsis size={17} />
          </button>
        </div>
        <div className="text-base font-semibold text-note-primary">
          {note.name.replace('.md', '')}
        </div>
        <div className="text-sm text-note-secondary pt-1.5 truncate">
          {stripMarkdown(note.content).slice(0, 50)}
        </div>
      </div>

      {isToolbarOpen && (
        <div
          className="absolute right-4 top-8 z-20 bg-white border shadow-md w-48 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-gray-600">Options</span>
            <button onClick={() => onToggleToolbar(null)}>
              <X size={16} />
            </button>
          </div>
          <button onClick={() => {
            onDeleteNote(note.name);
            onToggleToolbar(null);
          }} className="flex items-center gap-2 text-sm text-red-600 hover:bg-gray-100 p-2 rounded w-full">
            <Trash2 size={16} /> Delete
          </button>
          <button onClick={() => {
            onToggleImportant(note.folderName, note.name, !note.isImportant);
            onToggleToolbar(null);
          }} className="flex items-center gap-2 text-sm text-yellow-600 hover:bg-gray-100 p-2 rounded w-full">
            <Star size={16} /> Star
          </button>
          <button onClick={() => {
            handleExportPDF({
              content: note.content,
              fileName: note.name.replace(/\.md$/, '') + '.pdf',
            });
            onToggleToolbar(null);
          }} className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-2 rounded w-full">
            <FileDown size={16} color="#0055ff" /> Save as PDF
          </button>
          {!renameModal ? (
            <button
              onClick={openModal}
              className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded w-full transition"
            >
              <FolderPen size={16} /> Rename
            </button>
          ) : (
            <div className="bg-white w-full px-2 py-1">
              <input
                type="text"
                placeholder="New name"
                className="w-full text-sm rounded border border-gray-300 p-1 outline-none bg-transparent"
                onChange={(e) => setRenameName(e.target.value)}
              />
              <button onClick={HandleRename} className='bg-blue-600 w-full text-sm rounded mt-1 text-white p-1'>
                Rename
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
