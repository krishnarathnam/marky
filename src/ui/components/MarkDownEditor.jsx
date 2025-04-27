import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Eye, SquareSplitHorizontal } from 'lucide-react';

const initialMarkdown = `# Markdown Editor for [React](https://facebook.github.io/react/)
**Hello world!!!**
`;

export default function MarkDownEditor() {
  const [value, setValue] = useState(initialMarkdown);
  const [preview, setPreview] = useState('edit'); // initial state should be 'edit'

  function changePreview(mode) {
    if (preview === 'edit') {
      setPreview(mode); // Corrected to properly set preview state
    } else {
      setPreview('edit')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* MDEditor Container */}
      <div className="flex-1 overflow-hidden">
        <MDEditor
          height="100%" // Set height to 100% of the parent container
          preview={preview}
          value={value}
          onChange={setValue}
          commandsFilter={(cmd) => {
            // Exclude 'edit', 'live', and 'preview' commands
            if (/(edit|live|preview)/.test(cmd.name)) {
              return false;
            }
            return cmd;
          }}
          className="bg-white" // Apply custom class to the editor container
        />
      </div>

      {/* Toggle Preview Mode Button */}
      <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center rounded-md bg-gray-100 border border-gray-300 cursor-pointer z-10">
        {/* Preview Button */}
        <div className="hover:bg-gray-200 m-2 border-b-1">
          <button onClick={() => changePreview('preview')}> {/* Corrected */}
            <Eye className="text-gray-700" size={19} />
          </button>
        </div>

        {/* Live Mode Button */}
        <div className="hover:bg-gray-200 m-1">
          <button onClick={() => changePreview('live')}> {/* Corrected */}
            <SquareSplitHorizontal size={19} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
