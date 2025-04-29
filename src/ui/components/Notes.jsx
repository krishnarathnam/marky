export default function Notes({ note, index, onSelectedNote }) {

  function stripMarkdown(text) {
    return text
      .replace(/[#_*`>~-]/g, '') // Remove common markdown symbols
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Replace [text](link) with just text
      .replace(/!\[(.*?)\]\(.*?\)/g, '$1') // Replace ![alt](img) with alt
      .replace(/^\s*>+/gm, '') // Remove blockquotes
      .replace(/^\s*([-*]|\d+\.)\s+/gm, '') // Remove list bullets
      .trim();
  }
  return (
    <div key={index} className="p-2 flex flex-col w-full hover:bg-gray-200 transition bg-gray-50 border-[#d0cfcf] border-b-1" onClick={() => onSelectedNote(note)}>
      <div className="transition backdrop-blur-sm">
        <div className="text-xs text-gray-400 mb-2">Last modified: {note.lastModified}</div>
        <div className="text-base font-semibold text-gray-700">
          {note.name.replace('.md', '')}
        </div>
        <div className="text-sm text-gray-500 y- pt-1.5 truncate">
          {stripMarkdown(note.content).slice(0, 50)}
        </div>
      </div>
    </div>
  );
}
