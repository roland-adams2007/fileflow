import { useState } from "react";
import { X } from "lucide-react";

const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  showExpiration,
}) => {
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(name, expiresAt || null);
        setName("");
        setExpiresAt("");
        onClose();
      } catch (error) {
        console.error("Error submitting:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName("");
      setExpiresAt("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-gray-700 rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
                required
                disabled={isSubmitting}
              />
            </div>

            {showExpiration && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Leave empty for no expiration
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;