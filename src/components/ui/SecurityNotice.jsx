import { AlertCircle } from "lucide-react";

const SecurityNotice = () => {
  return (
    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
      <div className="flex-1">
        <p className="font-medium text-yellow-400">
          Important Security Notice
        </p>
        <p className="text-sm text-gray-300 mt-1">
          API keys grant full access to your account. Keep them secure and
          never share them publicly. Rotate your keys regularly and revoke any
          keys that are no longer needed.
        </p>
      </div>
    </div>
  );
};

export default SecurityNotice;