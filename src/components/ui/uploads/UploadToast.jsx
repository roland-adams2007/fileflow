import { Upload as UploadIcon, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const UploadToast = ({ fileName, progress }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#1e293b] border border-gray-700 rounded-lg shadow-xl z-50 w-80">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded">
              <UploadIcon size={16} className="text-blue-400" />
            </div>
            <span className="font-medium text-sm">Uploading file</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={16} />
          </button>
        </div>
        
        <p className="text-sm text-gray-300 mb-3 truncate">{fileName}</p>
        
        <div className="mb-2">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{progress}%</span>
          {progress >= 100 ? (
            <div className="flex items-center gap-1 text-green-400">
              <Check size={12} />
              <span>Completed</span>
            </div>
          ) : (
            <span>Uploading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadToast;