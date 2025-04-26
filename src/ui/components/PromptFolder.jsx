
export default function PromptFolder({ setFolderName, closeModal, createNewFolder }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 bg-opacity-50 fixed inset-0 z-10">
      {/* Modal */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-auto">
        <h2 className="text-xl font-semibold mb-4">Create a New Folder</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Enter folder name"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="text-gray-600 border rounded p-2" onClick={closeModal}>Cancel</button>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={createNewFolder}>Create</button>
        </div>
      </div>
    </div>
  )
}

