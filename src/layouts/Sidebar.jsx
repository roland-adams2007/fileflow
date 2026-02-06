import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Upload, Folder, Key, User, LogOut, Home, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e293b] rounded-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#1e293b] border-r border-gray-700
        flex flex-col transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Upload className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold">FileFlow</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/u/file-manager"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              location.pathname === "/u/file-manager"
                ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Folder size={20} />
            <span className="font-medium">File Manager</span>
          </Link>

          <Link
            to="/u/api-keys"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              location.pathname === "/u/api-keys"
                ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Key size={20} />
            <span className="font-medium">API Keys</span>
          </Link>

          <Link
            to="/u/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              location.pathname === "/u/profile"
                ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => {
              navigate("/logout");
            }}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
