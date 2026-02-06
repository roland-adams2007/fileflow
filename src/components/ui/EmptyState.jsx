import { Key } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <Key className="w-16 h-16 mx-auto mb-4 text-gray-600" />
      <p className="text-gray-400">No API keys found</p>
      <p className="text-sm text-gray-500 mt-2">
        Create your first API key to get started
      </p>
    </div>
  );
};

export default EmptyState;