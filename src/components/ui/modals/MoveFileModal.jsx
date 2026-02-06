import { useState } from "react";
import { Folder, Home, X } from "lucide-react";

const MoveFileModal = ({ isOpen, onClose, onMove, folders, currentFolderId, fileName }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  if (!isOpen) return null;

  const handleMove = () => {
    onMove(selectedFolder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] border border-gray-700 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Move "{fileName}"</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-4">Select destination folder:</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div
              onClick={() => setSelectedFolder(null)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                selectedFolder === null
                  ? "bg-blue-500/20 border border-blue-500"
                  : "hover:bg-gray-700"
              }`}
            >
              <Home size={18} className="text-blue-400" />
              <span>Home (No Folder)</span>
            </div>
            {folders
              ?.filter((folder) => folder.id !== currentFolderId)
              .map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${
                    selectedFolder === folder.id
                      ? "bg-blue-500/20 border border-blue-500"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <Folder size={18} className="text-gray-400" />
                  <span>{folder.name}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveFileModal;