
import React, { useState } from 'react';
import { Eye, SquareSplitHorizontal, Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

const initialMarkdown = `# Markdown Editor for [React](https://facebook.github.io/react/)
**Hello world!!!**

\`\`\`javascript
console.log('Hello, Markdown!');
\`\`\`
`;

export default function MarkdownEditor() {
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
      {/* Editor or Preview */}
      <div className="flex-1 overflow-auto p-4 bg-white">
        {preview === 'edit' && (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-full border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Write your markdown here..."
          />
        )}

        {preview === 'preview' && (
          <div className="prose max-w-full">
            <ReactMarkdown
              children={value}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialOceanic}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-100 rounded px-1" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        )}

        {preview === 'live' && (
          <div className="grid grid-cols-2 gap-4 h-full">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-full border border-gray-300 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Write your markdown here..."
            />
            <div className="prose max-w-full overflow-auto p-4 border border-gray-300 rounded-md bg-gray-50">
              <ReactMarkdown
                children={value}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={materialOceanic}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 rounded px-1" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center rounded-md bg-gray-100 border border-gray-300 cursor-pointer z-10">
        <div className="hover:bg-gray-200 m-2 border-b-1">
          <button onClick={() => changePreview('preview')}>
            {preview === 'edit' ? (
              <Eye className="text-gray-700" size={19} />
            ) : (
              <Pencil className="text-gray-700" size={19} />
            )}
          </button>
        </div>

        <div className="hover:bg-gray-200 m-1">
          <button onClick={() => changePreview('live')}>
            <SquareSplitHorizontal size={19} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
