import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Folder,
  Home,
  Search,
  Upload as UploadIcon,
  Grid,
  List,
  ChevronRight,
  X,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import UploadModal from "../components/ui/uploads/UploadModal";
import UploadToast from "../components/ui/uploads/UploadToast";
import ConfirmModal from "../components/ui/modals/ConfirmModal";
import InputModal from "../components/ui/modals/InputModal";
import MoveFileModal from "../components/ui/modals/MoveFileModal";
import FileCard from "../components/ui/files/FileCard";
import FileDetailsSidebar from "../components/ui/files/FileDetailsSidebar";
import Pagination from "../components/ui/files/Pagination";
import { useFileStore } from "../store/store";

const FileManager = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPageFromUrl = parseInt(searchParams.get("page") || "1");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadToast, setUploadToast] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(new Set());

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
  });
  const [moveModal, setMoveModal] = useState({
    isOpen: false,
    file: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDetailsSidebarOpen, setIsDetailsSidebarOpen] = useState(false);

  const {
    files,
    folders,
    fetchFiles,
    uploadFile,
    deleteFile,
    deleteFolder,
    createFolder,
    moveFile,
    currentFolder,
    setCurrentFolder,
    uploading,
    uploadProgress,
    loading,
    pagination,
    changePage,
  } = useFileStore();

  useEffect(() => {
    const folderIdParam = folderId ? parseInt(folderId) : null;
    setCurrentFolder(folderIdParam);
    fetchFiles(folderIdParam, currentPageFromUrl);
  }, [folderId, currentPageFromUrl]);

  const buildFolderTree = (foldersList) => {
    const folderMap = {};
    const rootFolders = [];

    foldersList?.forEach((folder) => {
      folderMap[folder.id] = { ...folder, children: [] };
    });

    foldersList?.forEach((folder) => {
      if (folder.parent_id && folderMap[folder.parent_id]) {
        folderMap[folder.parent_id].children.push(folderMap[folder.id]);
      } else {
        rootFolders.push(folderMap[folder.id]);
      }
    });

    return rootFolders;
  };

  const toggleFolderExpansion = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (folderList, level = 0, parentPath = []) => {
    return folderList?.map((folder) => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = currentFolder === folder.id;
      const currentPath = [...parentPath, folder.id];

      const filteredChildren = folder.children?.filter((child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      const hasMatchingChildren =
        filteredChildren && filteredChildren.length > 0;
      const folderMatchesSearch = folder.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (searchQuery && !folderMatchesSearch && !hasMatchingChildren) {
        return null;
      }

      return (
        <div key={folder.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#0f172a] ${
              isSelected ? "bg-[#0f172a] text-blue-400" : "text-gray-300"
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => handleFolderClick(folder.id)}
          >
            {folder.children?.length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolderExpansion(folder.id);
                }}
                className="p-0.5 hover:bg-gray-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRightIcon size={14} />
                )}
              </button>
            ) : (
              <div className="w-5" />
            )}
            <Folder size={14} />
            <span className="text-sm truncate">{folder.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder.id);
              }}
              className="ml-auto p-0.5 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>

          {isExpanded && folder.children?.length > 0 && (
            <div className="ml-5">
              {renderFolderTree(
                filteredChildren || folder.children,
                level + 1,
                currentPath,
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setUploadToast({
        fileName: file.name,
        progress: 0,
      });

      try {
        await uploadFile(file, currentFolder);
        setUploadToast((prev) => ({ ...prev, progress: 100 }));
      } catch (error) {
        setUploadToast(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);

    changePage(newPage);
  };

  const handleFolderClick = (folderId) => {
    navigate(`/u/file-manager/${folderId}?page=1`);
  };

  const handleHomeClick = () => {
    navigate("/u/file-manager?page=1");
  };

  const handleDeleteFile = (uuid) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete File",
      message:
        "Are you sure you want to delete this file? This action cannot be undone.",
      onConfirm: async () => {
        await deleteFile(uuid);
        if (selectedFile?.uuid === uuid) {
          setIsDetailsSidebarOpen(false);
          setSelectedFile(null);
        }
      },
    });
  };

  const handleDeleteFolder = (folderId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Folder",
      message:
        "Are you sure you want to delete this folder and all its contents? This action cannot be undone.",
      onConfirm: async () => {
        await deleteFolder(folderId);
      },
    });
  };

  const handleCreateFolder = () => {
    setInputModal({
      isOpen: true,
      title: "Create New Folder",
      placeholder: "Enter folder name...",
      onSubmit: async (name) => {
        await createFolder(name, currentFolder);
      },
    });
  };

  const handleImageClick = (file) => {
    setSelectedFile(file);
    setIsDetailsSidebarOpen(true);
  };

  const handleMoveFile = (file) => {
    setMoveModal({
      isOpen: true,
      file: file,
    });
  };

  const handleMoveConfirm = async (destinationFolderId) => {
    if (moveModal.file) {
      await moveFile(moveModal.file.uuid, destinationFolderId);
      setMoveModal({ isOpen: false, file: null });
    }
  };

  const filteredFiles = files?.filter(
    (file) =>
      file.file_original_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      file.type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const folderTree = buildFolderTree(folders);
  const renderedFolders = renderFolderTree(folderTree);

  const getBreadcrumbPath = () => {
    if (!currentFolder) return [];

    const path = [];
    let current = folders?.find((f) => f.id === currentFolder);

    while (current) {
      path.unshift(current);
      current = folders?.find((f) => f.id === current.parent_id);
    }

    return path;
  };

  const getCountDisplay = () => {
    const { totalItems, currentPage, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) {
      return "No files found";
    }

    return `Showing ${start}-${end} of ${totalItems} files`;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row">
      {dragOver && (
        <div
          className="fixed inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed z-50 flex items-center justify-center"
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="text-center">
            <UploadIcon className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <p className="text-xl font-semibold">Drop files to upload</p>
          </div>
        </div>
      )}

      <aside className="w-full lg:w-72 bg-[#1a2332] border-r border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Media Library</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Type to filter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <Search
              className="absolute right-3 top-3 text-gray-500"
              size={18}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div
              className={`flex items-center gap-2 px-3 py-2 mb-2 cursor-pointer hover:bg-[#0f172a] rounded-lg ${
                !currentFolder ? "text-blue-400 bg-[#0f172a]" : "text-gray-300"
              }`}
              onClick={handleHomeClick}
            >
              <Home size={18} />
              <span className="font-semibold text-sm">Home</span>
            </div>
            <div className="space-y-1">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    >
                      <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
                      <div className="w-24 h-3 bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))
                : renderedFolders}
            </div>
          </div>

          <button
            onClick={handleCreateFolder}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 justify-center"
          >
            <Folder size={18} />
            <span>New Folder</span>
          </button>
        </div>
      </aside>

      <main
        className="flex-1 flex flex-col"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <header className="bg-[#1e293b] border-b border-gray-700 px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 flex-wrap">
            <span
              onClick={handleHomeClick}
              className="cursor-pointer hover:text-white"
            >
              Home
            </span>
            {getBreadcrumbPath().map((folder, index) => (
              <div key={folder.id} className="flex items-center gap-2">
                <ChevronRight size={16} />
                <span
                  onClick={() => handleFolderClick(folder.id)}
                  className="cursor-pointer hover:text-white"
                >
                  {folder.name}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 lg:px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2"
            >
              <UploadIcon size={18} />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#0f172a] p-4 lg:p-6">
          <div className="mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <span className="text-sm text-gray-400">{getCountDisplay()}</span>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex gap-1 bg-[#1e293b] rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1e293b] border border-gray-700 rounded-lg p-3 animate-pulse"
                >
                  <div className="aspect-square bg-gray-800 rounded-lg mb-3" />
                  <div className="space-y-2">
                    <div className="w-3/4 h-3 bg-gray-700 rounded" />
                    <div className="w-1/2 h-2 bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div
                className={`gap-4 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                    : "space-y-2"
                }`}
              >
                {filteredFiles?.map((file) => (
                  <FileCard
                    key={file.uuid}
                    file={file}
                    viewMode={viewMode}
                    onDelete={handleDeleteFile}
                    onImageClick={handleImageClick}
                    onMove={handleMoveFile}
                  />
                ))}
              </div>

              {filteredFiles?.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No files found</p>
                </div>
              )}

              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </>
          )}
        </div>
      </main>

      {isDetailsSidebarOpen && (
        <FileDetailsSidebar
          file={selectedFile}
          isOpen={isDetailsSidebarOpen}
          onClose={() => {
            setIsDetailsSidebarOpen(false);
            setSelectedFile(null);
          }}
          onDelete={handleDeleteFile}
        />
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentFolder={currentFolder}
      />

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
      />

      <MoveFileModal
        isOpen={moveModal.isOpen}
        onClose={() => setMoveModal({ isOpen: false, file: null })}
        onMove={handleMoveConfirm}
        folders={folders}
        currentFolderId={currentFolder}
        fileName={moveModal.file?.file_original_name}
      />

      {uploadToast && <UploadToast {...uploadToast} />}
    </div>
  );
};

export default FileManager;
