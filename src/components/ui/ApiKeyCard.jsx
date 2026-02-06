import { useState } from "react";
import {
  Key,
  Calendar,
  Clock,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

const ApiKeyCard = ({ apiKey, onRevoke, onDelete, onRegenerate }) => {
  const [showKey, setShowKey] = useState(false);
  const [showSecretHash, setShowSecretHash] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [copiedSecretId, setCopiedSecretId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "expired":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "revoked":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const handleCopyKey = (keyId, keyValue) => {
    if (!keyValue) return;
    navigator.clipboard.writeText(keyValue);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCopySecret = (keyId, secretValue) => {
    if (!secretValue) return;
    navigator.clipboard.writeText(secretValue);
    setCopiedSecretId(keyId);
    setTimeout(() => setCopiedSecretId(null), 2000);
  };

  const getMaskedKey = () => {
    // Use api_key field instead of key field
    if (apiKey?.api_key) {
      const prefix = apiKey.api_key.substring(0, 8);
      return `${prefix}${"*".repeat(32)}`;
    }
    if (apiKey?.prefix) {
      return `${apiKey.prefix}${"*".repeat(32)}`;
    }
    return `sk_live_${"*".repeat(32)}`;
  };

  const getMaskedSecretHash = () => {
    if (apiKey?.api_secret_hash) {
      const firstChars = apiKey.api_secret_hash.substring(0, 8);
      const lastChars = apiKey.api_secret_hash.substring(
        apiKey.api_secret_hash.length - 8,
      );
      return `${firstChars}${"*".repeat(16)}${lastChars}`;
    }
    return `${"*".repeat(8)}${"*".repeat(16)}${"*".repeat(8)}`;
  };

  const hasFullApiKey = () => {
    // Check api_key field, not key field
    return apiKey?.api_key && apiKey.api_key.length > 16;
  };

  const hasFullSecretHash = () => {
    return apiKey?.api_secret_hash && apiKey.api_secret_hash.length > 24;
  };

  if (!apiKey) return null;

  return (
    <div className="bg-[#1e293b] border border-gray-700 rounded-lg p-4 hover:bg-[#1e293b]/70 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="font-semibold">{apiKey.name || "Unnamed Key"}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(
                apiKey.status || "unknown"
              )}`}
            >
              {(apiKey.status || "unknown")
                .charAt(0)
                .toUpperCase() + (apiKey.status || "unknown").slice(1)}
            </span>
            {apiKey.expires_at && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Clock size={14} />
                <span>Expires: {formatDate(apiKey.expires_at)}</span>
                {isExpired(apiKey.expires_at) && (
                  <span className="text-red-400 text-xs">(Expired)</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <Key size={14} />
              {/* Show actual prefix from api_key if available */}
              <span>Prefix: {apiKey.api_key ? apiKey.api_key.substring(0, 8) + "..." : apiKey.prefix || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Created: {formatDate(apiKey.created_at)}</span>
            </div>
            {apiKey.last_used_at && (
              <div className="flex items-center gap-2">
                <span>Last used: {formatDate(apiKey.last_used_at)}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* API Key Section */}
            <div className="p-3 bg-[#0f172a] rounded border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  API Key
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                    title={showKey ? "Hide API Key" : "Show API Key"}
                  >
                    {showKey ? (
                      <EyeOff size={16} className="text-blue-400" />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  <button
                    // Use api_key field for copying
                    onClick={() => handleCopyKey(apiKey.id, apiKey.api_key || "")}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                    title="Copy API Key"
                  >
                    {copiedKeyId === apiKey.id ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
              <code className="text-sm font-mono break-all block">
                {showKey && apiKey.api_key
                  ? apiKey.api_key
                  : getMaskedKey()}
              </code>
              {showKey && apiKey.api_key && (
                <p className="text-xs text-yellow-400 mt-2">
                  🔒 Keep this key secure. Anyone with this key can access your account.
                </p>
              )}
              {!hasFullApiKey() && (
                <p className="text-xs text-red-400 mt-2">
                  ⚠️ Full API key not available. You may need to regenerate it.
                </p>
              )}
            </div>

            {/* Secret Hash Section */}
            <div className="p-3 bg-[#0f172a] rounded border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">
                  Secret Hash
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSecretHash(!showSecretHash)}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                    title={
                      showSecretHash ? "Hide Secret Hash" : "Show Secret Hash"
                    }
                  >
                    {showSecretHash ? (
                      <EyeOff size={16} className="text-purple-400" />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleCopySecret(apiKey.id, apiKey.api_secret_hash || "")
                    }
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                    title="Copy Secret Hash"
                  >
                    {copiedSecretId === apiKey.id ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>
              <code className="text-sm font-mono break-all block">
                {showSecretHash && apiKey.api_secret_hash
                  ? apiKey.api_secret_hash
                  : getMaskedSecretHash()}
              </code>
              {showSecretHash && apiKey.api_secret_hash && (
                <p className="text-xs text-gray-400 mt-2">
                  🔒 This is a hashed version of your secret. The original secret is never stored.
                </p>
              )}
              {!hasFullSecretHash() && (
                <p className="text-xs text-orange-400 mt-2">
                  ℹ️ Secret hash may not be available for older keys.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
          {(apiKey.status === "active" || apiKey.is_active === 1) && (
            <>
              <button
                onClick={() => onRegenerate(apiKey.id, apiKey.name)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium whitespace-nowrap transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={() => onRevoke(apiKey.id, apiKey.name)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium whitespace-nowrap transition-colors"
              >
                Revoke
              </button>
            </>
          )}
          {(apiKey.status === "revoked" || apiKey.is_active === 0) && (
            <button
              onClick={() => onDelete(apiKey.id, apiKey.name)}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyCard;