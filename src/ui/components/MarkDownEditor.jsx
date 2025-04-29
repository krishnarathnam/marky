import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Eye, SquareSplitHorizontal, Pencil } from 'lucide-react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const initialMarkdown = `# Markdown Editor for [React](https://facebook.github.io/react/)
**Hello world!!!**

## Lists Example
### Ordered List
1. First item
2. Second item
3. Third item

### Unordered List
- First point
- Second point
- Third point
`;

export default function MarkDownEditor({ onSaveNote, selectedNote }) {
  const [value, setValue] = useState(selectedNote ? selectedNote.content : initialMarkdown);
  const [preview, setPreview] = useState('edit'); // 'edit' | 'preview' | 'live'

  useEffect(() => {
    if (selectedNote) {
      setValue(selectedNote.content);
    }
  }, [selectedNote]);

  function changePreview(mode) {
    if (preview === 'edit') {
      setPreview(mode);
    } else {
      setPreview('edit');
    }
  }

  return (
    <div data-color-mode="light" className="h-screen flex flex-col">
      {/* MDEditor Container */}
      <div className="flex-1 h-screen">
        <MDEditor
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            onSaveNote(newValue, selectedNote.name);
          }}
          preview={preview}
          commandsFilter={(cmd) => {
            if (/(edit|live|preview)/.test(cmd.name)) {
              return false;
            }
            return cmd;
          }}
          height="100%"
          style={{ overflow: 'auto' }}
          className="custom-md-editor"
        />
      </div>


      <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center rounded-md bg-gray-100 border border-gray-300 cursor-pointer z-10 p-2">
        <button onClick={() => changePreview('preview')} className="hover:bg-gray-200 m-2">
          {preview === 'edit' ? <Eye className="text-gray-700" size={19} /> : <Pencil className="text-gray-700" size={19} />}
        </button>
        <button onClick={() => changePreview('live')} className="hover:bg-gray-200 m-1">
          <SquareSplitHorizontal size={19} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
