import React, { useRef, useEffect, useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor';
import mermaid from 'mermaid';
import remarkGfm from 'remark-gfm'
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

## Task List

- [ ] Unchecked task
- [x] Checked task
- [ ] Another task
`;

export default function MarkDownEditor({ onSaveNote, selectedNote }) {
  const [value, setValue] = useState(selectedNote ? selectedNote.content : initialMarkdown);
  const [preview, setPreview] = useState('edit');
  const lastMermaidCodeRef = useRef('');
  const mermaidCache = useRef(new Map());

  useEffect(() => {
    if (selectedNote) {
      setValue(selectedNote.content);
    }
  }, [selectedNote?.name, selectedNote?.folderName]);

  function changePreview(mode) {
    setPreview(prev => (prev === 'edit' ? mode : 'edit'));
  }

  // Function to handle checkbox toggling
  const handleCheckboxToggle = useCallback(() => {
    if (preview === 'edit') return;

    const previewContainer = document.querySelector('.w-md-editor-preview');
    if (!previewContainer) return;

    const handleClick = (e) => {
      if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        e.preventDefault();

        const listItem = e.target.closest('li');
        if (!listItem) return;

        const text = listItem.textContent.trim();
        const lines = value.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes('- [ ]') && text.includes(line.replace('- [ ]', '').trim())) {
            lines[i] = line.replace('- [ ]', '- [x]');
            const newValue = lines.join('\n');
            setValue(newValue);
            if (onSaveNote && selectedNote) {
              onSaveNote(selectedNote.folderName, newValue, selectedNote.name);
            }
            break;
          } else if (line.includes('- [x]') && text.includes(line.replace('- [x]', '').trim())) {
            lines[i] = line.replace('- [x]', '- [ ]');
            const newValue = lines.join('\n');
            setValue(newValue);
            if (onSaveNote && selectedNote) {
              onSaveNote(selectedNote.folderName, newValue, selectedNote.name);
            }
            break;
          }
        }
      }
    };

    previewContainer.addEventListener('click', handleClick);
    return () => {
      previewContainer.removeEventListener('click', handleClick);
    };
  }, [value, preview, onSaveNote, selectedNote]);


useEffect(() => {
  if (preview === 'edit') return;

  const mermaidBlocks = document.querySelectorAll('pre > code.language-mermaid');
  if (!mermaidBlocks.length) return;

  mermaid.initialize({ startOnLoad: false });

  mermaidBlocks.forEach((codeBlock, i) => {
    const currentCode = codeBlock.textContent.trim();
    const pre = codeBlock.parentElement;
    const containerId = `mermaid-${i}`;

    // Remove old render if present
    const existing = document.getElementById(containerId);
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.margin = '1rem 0';

    if (mermaidCache.current.has(currentCode)) {
      wrapper.innerHTML = mermaidCache.current.get(currentCode);
    } else {
      const container = document.createElement('div');
      container.className = 'mermaid';
      container.id = containerId;
      container.innerHTML = currentCode;
      wrapper.appendChild(container);

      try {
        mermaid.render(containerId, currentCode).then(({ svg }) => {
          mermaidCache.current.set(currentCode, svg);
          wrapper.innerHTML = svg;
        }).catch(err => {
          container.innerHTML = `<pre style="color: red;">Mermaid error: ${err.message}</pre>`;
        });
      } catch (err) {
        container.innerHTML = `<pre style="color: red;">Mermaid error: ${err.message}</pre>`;
      }
    }

    pre.style.display = 'none';
    pre.parentElement.insertBefore(wrapper, pre.nextSibling);
  });

  handleCheckboxToggle();
}, [value, preview, handleCheckboxToggle]);


  return (
    <div data-color-mode="light" className="h-screen flex flex-col">
      <div className="h-screen ">
        <MDEditor
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            if (onSaveNote && selectedNote) {
              onSaveNote(selectedNote.folderName, newValue, selectedNote.name);
            }
          }}
          preview={preview}
          commandsFilter={(cmd) => {
            if (/(edit|live|preview)/.test(cmd.name)) {
              return false;
            }
            return cmd;
          }}
          previewOptions={{
            remarkPlugins: [remarkMath, remarkGfm],
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
