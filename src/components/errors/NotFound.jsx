import React from "react";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
            <AlertCircle size={64} className="text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Error Code */}
        <div className="mb-8">
          <div className="inline-flex items-baseline">
            <span className="text-6xl font-bold text-red-400">4</span>
            <span className="text-6xl font-bold text-gray-300">0</span>
            <span className="text-6xl font-bold text-red-400">4</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-700 hover:border-gray-600"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>

          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
          >
            <Home size={20} />
            <span>Go to Home</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <a
              href="/support"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
