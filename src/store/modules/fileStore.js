import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { fileToBase64 } from "../../utils/fileToBase64";
import axiosInstance from "../../api/axiosinstance";

export const useFileStore = create(
  devtools(
    persist(
      (set, get) => ({
        files: [],
        folders: [],
        uploading: false,
        uploadProgress: 0,
        error: null,
        currentFolder: null,
        loading: false,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 20,
          hasNext: false,
          hasPrev: false
        },

        fetchFiles: async (folderId = null, page = 1) => {
          set({ loading: true, error: null });
          try {
            const params = {};
            if (folderId) params.folderId = folderId;
            params.page = page;
            params.limit = 20;

            const response = await axiosInstance.get("/files", { params });

            const data = response.data?.data;
            set({
              files: data.uploads,
              folders: data.folders,
              currentFolder: folderId,
              pagination: data.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: 20,
                hasNext: false,
                hasPrev: false
              },
              loading: false,
            });
            return data;
          } catch (error) {
            set({ 
              error: error.response?.data?.message || error.message,
              loading: false 
            });
            throw error;
          }
        },

        changePage: (page) => {
          const { currentFolder } = get();
          get().fetchFiles(currentFolder, page);
        },

        uploadFile: async (file, folderId = null) => {
          set({ uploading: true, error: null, uploadProgress: 0 });
          try {
            const base64Data = await fileToBase64(file);

            const response = await axiosInstance.post("/files/upload", {
              fileData: base64Data,
              fileName: file.name,
              folderId: folderId,
            });

            const data = response.data?.data;
            
            // After upload, refresh files to show the new file
            await get().fetchFiles(folderId, 1);
            
            set({
              uploading: false,
              uploadProgress: 100,
            });
            return data;
          } catch (error) {
            set({
              error: error.response?.data?.message || error.message,
              uploading: false,
              uploadProgress: 0,
            });
            throw error;
          }
        },

        createFolder: async (name, parentId = null) => {
          set({ error: null });
          try {
            const response = await axiosInstance.post("/files/folder", {
              name: name,
              parentId: parentId,
            });

            const data = response.data?.data;
            
            // Refresh current page
            const { currentFolder, pagination } = get();
            await get().fetchFiles(currentFolder, pagination.currentPage);
            
            return data;
          } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
          }
        },

        deleteFile: async (uuid) => {
          set({ error: null });
          try {
            await axiosInstance.delete(`/files/file/${uuid}`);

            // Refresh current page after deletion
            const { currentFolder, pagination } = get();
            await get().fetchFiles(currentFolder, pagination.currentPage);
            
            return true;
          } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
          }
        },

        deleteFolder: async (folderId) => {
          set({ error: null });
          try {
            await axiosInstance.delete(`/files/folder/${folderId}`);

            // If we're deleting the current folder, go to home
            const { currentFolder } = get();
            if (currentFolder === folderId) {
              set({ currentFolder: null });
            }
            
            // Refresh the list
            const { pagination } = get();
            await get().fetchFiles(currentFolder === folderId ? null : currentFolder, 1);
            
            return true;
          } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
          }
        },

        moveFile: async (uuid, destinationFolderId) => {
          set({ error: null });
          try {
            const response = await axiosInstance.patch(`/files/move/${uuid}`, {
              folderId: destinationFolderId,
            });

            // Refresh current page
            const { currentFolder, pagination } = get();
            await get().fetchFiles(currentFolder, pagination.currentPage);

            return response.data?.data;
          } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
          }
        },

        setCurrentFolder: (folderId) => set({ currentFolder: folderId }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        setUploadProgress: (progress) => set({ uploadProgress: progress }),
        setLoading: (loading) => set({ loading }),
      }),
      {
        name: "file-storage",
        partialize: (state) => ({
          files: state.files,
          folders: state.folders,
          currentFolder: state.currentFolder,
        }),
      },
    ),
    { name: "FileStore" },
  ),
);