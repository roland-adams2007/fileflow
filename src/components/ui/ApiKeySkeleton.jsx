const ApiKeySkeleton = () => {
  return (
    <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-4 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-48 h-5 bg-gray-700 rounded"></div>
            <div className="w-20 h-6 bg-gray-700 rounded-full"></div>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-32 h-4 bg-gray-700 rounded"></div>
            <div className="w-40 h-4 bg-gray-700 rounded"></div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#0f172a] rounded border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div className="w-16 h-3 bg-gray-700 rounded"></div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-3 bg-gray-700 rounded"></div>
                  <div className="w-10 h-5 bg-gray-700 rounded-full"></div>
                </div>
              </div>
              <div className="w-full h-4 bg-gray-700 rounded"></div>
            </div>

            <div className="p-3 bg-[#0f172a] rounded border border-gray-600">
              <div className="w-24 h-3 bg-gray-700 rounded mb-2"></div>
              <div className="w-full h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
          <div className="w-28 h-9 bg-gray-700 rounded"></div>
          <div className="w-28 h-9 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySkeleton;