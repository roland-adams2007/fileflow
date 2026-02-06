import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { debounce } from "lodash";
import ConfirmModal from "../components/ui/modals/ConfirmModal";
import InputModal from "../components/ui/modals/InputModal";
import Pagination from "../components/ui/files/Pagination";
import ApiKeyCard from "../components/ui/ApiKeyCard";
import ApiKeySkeleton from "../components/ui/ApiKeySkeleton";
import EmptyState from "../components/ui/EmptyState";
import SecurityNotice from "../components/ui/SecurityNotice";
import { useApiKeyStore } from "../store/store";
import { useSearchParams } from "react-router-dom";

const ApiKeys = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPageFromUrl = parseInt(searchParams.get("page") || "1");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [inputModal, setInputModal] = useState({
    isOpen: false,
    title: "",
    placeholder: "",
    onSubmit: () => {},
    showExpiration: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    apiKeys,
    loading,
    pagination,
    fetchApiKeys,
    createApiKey,
    revokeApiKey,
    regenerateApiKey,
    deleteApiKey,
    setCurrentFilterStatus,
    setCurrentSearch,
    changePage,
  } = useApiKeyStore();

  useEffect(() => {
    fetchApiKeys(currentPageFromUrl);
  }, [currentPageFromUrl]);

  const debouncedSearch = debounce((value) => {
    setCurrentSearch(value);
  }, 500);

  const handleSearch = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentFilterStatus(value);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    changePage(newPage);
  };

  const handleCreateApiKey = () => {
    setInputModal({
      isOpen: true,
      title: "Create New API Key",
      placeholder: "Enter API key name (e.g., 'Production Server')",
      showExpiration: true,
      onSubmit: async (name, expiresAt) => {
        await createApiKey(name, expiresAt);
      },
    });
  };

  const handleRevokeKey = (keyId, keyName) => {
    setConfirmModal({
      isOpen: true,
      title: "Revoke API Key",
      message: `Are you sure you want to revoke "${keyName}"? This action cannot be undone and will immediately disable all access using this key.`,
      onConfirm: async () => {
        await revokeApiKey(keyId);
      },
    });
  };

  const handleDeleteKey = (keyId, keyName) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete API Key",
      message: `Are you sure you want to permanently delete "${keyName}"? This action cannot be undone.`,
      onConfirm: async () => {
        await deleteApiKey(keyId);
      },
    });
  };

  const handleRegenerateKey = (keyId, keyName) => {
    setConfirmModal({
      isOpen: true,
      title: "Regenerate API Key",
      message: `Are you sure you want to regenerate "${keyName}"? The old key will be immediately invalidated and cannot be recovered.`,
      onConfirm: async () => {
        await regenerateApiKey(keyId);
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="bg-[#1e293b] border-b border-gray-700 px-4 lg:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">API Keys</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your API keys for accessing the platform programmatically
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateApiKey}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed px-4 lg:px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create API Key</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#0f172a] p-4 lg:p-6">
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search API keys by name or prefix..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={loading}
              className="w-full bg-[#1e293b] border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter size={16} />
              <span>Status:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              disabled={loading}
              className="bg-[#1e293b] border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        <SecurityNotice />

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ApiKeySkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {apiKeys?.map((key) => (
                <ApiKeyCard
                  key={key.id}
                  apiKey={key}
                  onRevoke={handleRevokeKey}
                  onDelete={handleDeleteKey}
                  onRegenerate={handleRegenerateKey}
                />
              ))}
            </div>

            {apiKeys?.length === 0 && !loading && <EmptyState />}

            <Pagination
              currentPage={pagination?.currentPage || 1}
              totalPages={pagination?.totalPages || 1}
              totalItems={pagination?.totalItems || 0}
              itemsPerPage={pagination?.itemsPerPage || 10}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      <InputModal
        isOpen={inputModal.isOpen}
        onClose={() => setInputModal({ ...inputModal, isOpen: false })}
        onSubmit={inputModal.onSubmit}
        title={inputModal.title}
        placeholder={inputModal.placeholder}
        showExpiration={inputModal.showExpiration}
      />
    </div>
  );
};

export default ApiKeys;