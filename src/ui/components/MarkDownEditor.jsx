import React, { useEffect, useState } from 'react';

import MDEditor from '@uiw/react-md-editor';
import mermaid from 'mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Eye, SquareSplitHorizontal, Pencil } from 'lucide-react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import 'katex/dist/katex.min.css';

const initialMarkdown = `# Mermaid + KaTeX Example

## Mermaid Diagram

\`\`\`mermaid
graph TD;
  A[Start] --> B{Is it working?};
  B -- Yes --> C[Great!];
  B -- No --> D[Check code];
\`\`\`

## Math Example

Inline: $E = mc^2$

Block:

$$
a^2 + b^2 = c^2
$$
`;

export default function MarkDownEditor({ onSaveNote, selectedNote }) {
  const [value, setValue] = useState(selectedNote ? selectedNote.content : initialMarkdown);
  const [preview, setPreview] = useState('edit');

  useEffect(() => {
    if (selectedNote) {
      setValue(selectedNote.content);
    }
  }, [selectedNote]);

  function changePreview(mode) {
    setPreview(prev => (prev === 'edit' ? mode : 'edit'));
  }

  useEffect(() => {
    if (preview === 'edit') return;

    mermaid.initialize({ startOnLoad: false });

    const mermaidBlocks = document.querySelectorAll('pre > code.language-mermaid');

    mermaidBlocks.forEach((codeBlock, i) => {
      const pre = codeBlock.parentElement;
      const containerId = `mermaid-${i}`;

      if (document.getElementById(containerId)) return;

      const container = document.createElement('div');
      container.className = 'mermaid';
      container.id = containerId;
      container.innerHTML = codeBlock.textContent;

      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.justifyContent = 'center';
      wrapper.style.margin = '1rem 0';
      wrapper.appendChild(container);

      pre.style.display = 'none';
      pre.parentElement.insertBefore(wrapper, pre.nextSibling);

      try {
        mermaid.init(undefined, `#${containerId}`);
      } catch (err) {
        container.innerHTML = `<pre style="color: red;">Mermaid error: ${err.message}</pre>`;
      }
    });
  }, [value, preview]);

  return (
    <div data-color-mode="light" className="h-screen flex flex-col">
      <div className="flex-1 h-screen">
        <MDEditor
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            onSaveNote(selectedNote.folderName, newValue, selectedNote.name);
          }}
          preview={preview}
          height="100%"
          className="custom-md-editor"
          previewOptions={{
            remarkPlugins: [remarkMath],
            rehypePlugins: [[rehypeKatex, { 
              strict: false,
              output: 'html'
            }]],
          }}
        />
      </div>

      <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center rounded-md bg-gray-100 border border-gray-300 cursor-pointer z-10 p-0.5">
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
