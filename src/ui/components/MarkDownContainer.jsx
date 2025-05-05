import MarkDownHeader from "./MarkDownHeader"
import MarkDownEditor from "./MarkDownEditor"

export default function MarkDownContainer({ onSaveNote, selectedNote }) {
  return (
    <div className="flex flex-col">
      {/*<arkDownHeader selectedNote={selectedNote} />*/}
      <MarkDownEditor onSaveNote={onSaveNote} selectedNote={selectedNote} />
    </div>
  )
}

