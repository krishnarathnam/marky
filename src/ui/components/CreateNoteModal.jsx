import React from "react";

export default function CreateNoteModal({ handleNewNoteSubmit, setNewNoteName }) {

  function getNowTime() {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    return formatted;
  }

  return (
    <form
      onSubmit={handleNewNoteSubmit} // Use the received prop
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.15 }}
      layout
    >
      <div className="border-border p-2 border-b-1">
        <div className="text-xs flex justify-between text-note-teriary mb-2">
          <div>Created at: {getNowTime()}</div>
        </div>
        <div className="text-base mb-3 font-semibold text-note-primary">
          <input
            type="text"
            onChange={(e) => setNewNoteName(e.target.value)} // Use the received prop
            className="border-border border-1 rounded-sm"
            autoFocus
          />
        </div>
        <div className="text-sm text-note-secondary pt-1.5 truncate"></div>
      </div>
    </form>
  );
}

