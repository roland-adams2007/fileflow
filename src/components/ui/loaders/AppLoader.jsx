import React from "react";
import { Loader2 } from "lucide-react";

const AppLoader = ({ message = "Loading your files..." }) => {
  return (
    <div className="fixed inset-0 bg-[#0f172a] z-50 flex items-center justify-center p-4">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5" />

      <div className="relative z-10 text-center max-w-md">
        {/* Simple spinner */}
        <div className="mb-8">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-white mb-3">FileFlow</h2>
        <p className="text-gray-400 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default AppLoader;
