import React, { useRef, useEffect, useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Eye, SquareSplitHorizontal, Pencil } from 'lucide-react';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import 'katex/dist/katex.min.css';

const initialMarkdown = `# Markdown Example

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
  const [debouncedValue, setDebouncedValue] = useState(value);
  const debounceTimeoutRef = useRef(null);

  // Debounce value changes
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [value]);

  useEffect(() => {
    if (selectedNote) {
      setValue(selectedNote.content);
    }
  }, [selectedNote?.name, selectedNote?.folderName]);

  function changePreview(mode) {
    setPreview(prev => (prev === 'edit' ? mode : 'edit'));
  }

  const handleValueChange = useCallback((newValue) => {
    setValue(newValue);
    if (onSaveNote && selectedNote) {
      onSaveNote(selectedNote.folderName, newValue, selectedNote.name);
    }
  }, [onSaveNote, selectedNote]);

  return (
    <div data-color-mode="light" className="h-screen flex flex-col">
      <div className="h-screen">
        <MDEditor
          value={preview === 'edit' ? value : debouncedValue}
          onChange={handleValueChange}
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
            }]]
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
