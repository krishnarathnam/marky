import { Eye, Pencil } from 'lucide-react';
import "easymde/dist/easymde.min.css";
import { useState, useRef, useEffect } from "react";
import SimpleMdeReact from "react-simplemde-editor";

export default function SimpleMDE() {
  const [value, setValue] = useState("# Markdown Editor\n\nThis is a **SimpleMDE** editor with a working preview toggle.\n\n- Write markdown here\n- Toggle preview with the eye button");
  const [preview, setPreview] = useState(false);
  const [mdeInstance, setMdeInstance] = useState(null);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (mdeInstance) {
      mdeInstance.togglePreview();
    }
  }, [preview, mdeInstance]);

  return (
    <div className="w-full relative">
      <SimpleMdeReact
        value={value}
        onChange={onChange}
        onCreate={(instance) => {  // Use the onCreate callback
          setMdeInstance(instance); // Store the instance
        }}
        options={{
          status: false,
          spellChecker: false,
          toolbar: [
            "bold",
            "italic",
            "strikethrough",
            "heading-1",
            "heading-2",
            "heading-3",
            "|",
            "quote",
            "code",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "image",
            "table",
            "|",
            "horizontal-rule",
            "guide",
          ],
        }}
      />
      <div className="fixed bottom-5 right-5 flex flex-col items-center justify-center rounded-md bg-gray-100 border border-gray-300 z-10">
        <button
          onClick={() => setPreview(!preview)}
          className="p-2 hover:bg-gray-200 transition-colors"
        >
          <Eye size={20} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
