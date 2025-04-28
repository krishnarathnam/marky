import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Eye, SquareSplitHorizontal, Pencil } from 'lucide-react';

import '@uiw/react-md-editor/dist/mdeditor.min.css';
import '@uiw/react-markdown-preview/dist/markdown.min.css';
const initialMarkdown = `# Markdown Editor for [React](https://facebook.github.io/react/)
**Hello world!!!**
`;

export default function MarkDownEditor() {
  const [value, setValue] = useState(initialMarkdown);
  const [preview, setPreview] = useState('edit'); // 'edit' | 'preview' | 'live'

  function changePreview(mode) {
    if (preview === 'edit') {
      setPreview(mode);
    } else {
      setPreview('edit');
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* MDEditor Container */}
      <div className="flex-1">
        <MDEditor
          value={value}
          onChange={setValue}
          preview={preview}
          theme="light" // 'light', 'dark', or 'classic'
          commandsFilter={(cmd) => {
            if (/(edit|live|preview)/.test(cmd.name)) {
              return false;
            }
            return cmd;
          }}
        />
      </div>

      {/* Toggle Preview Mode Button */}
      <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center rounded-md bg-gray-100 border border-gray-300 cursor-pointer z-10 p-2">
        {/* Preview Button */}
        <button onClick={() => changePreview('preview')} className="hover:bg-gray-200 m-2">
          {preview === 'edit' ? <Eye className="text-gray-700" size={19} /> : <Pencil className="text-gray-700" size={19} />}
        </button>

        {/* Live Mode Button */}
        <button onClick={() => changePreview('live')} className="hover:bg-gray-200 m-1">
          <SquareSplitHorizontal size={19} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
