import { useState, useRef, useEffect } from "react";
import { X, Upload as UploadIcon, File } from "lucide-react";
import { useFileStore } from "../../../store/store";

const UploadModal = ({ isOpen, onClose, currentFolder }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { uploadFile } = useFileStore();
  const dragCounter = useRef(0);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    dragCounter.current = 0;
    setIsDragging(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current = 0;
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current += 1;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current -= 1;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const file of files) {
        await uploadFile(file, currentFolder);
      }
      setFiles([]);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-xl w-full max-w-2xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Upload Files</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            disabled={uploading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div
            ref={dropZoneRef}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
                : "border-gray-600 hover:border-gray-500"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <UploadIcon
              className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                isDragging ? "text-blue-400" : "text-gray-400"
              }`}
            />
            <p className="text-lg font-medium mb-2">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-gray-400 mb-6">or click to browse</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
              disabled={uploading}
            />
            <label
              htmlFor="file-input"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Browse Files
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">
                Selected Files ({files.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded transition-colors hover:bg-gray-800/70"
                  >
                    <File className="text-gray-400 flex-shrink-0" size={18} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-700 rounded text-gray-400 transition-colors flex-shrink-0"
                      disabled={uploading}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            type="button"
          >
            {uploading ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                Uploading...
              </>
            ) : (
              `Upload ${files.length > 0 ? `(${files.length})` : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
