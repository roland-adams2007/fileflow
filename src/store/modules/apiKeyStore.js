import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../../api/axiosinstance";

export const useApiKeyStore = create(
  devtools(
    persist(
      (set, get) => ({
        apiKeys: [],
        loading: false,
        error: null,
        currentFilterStatus: "all",
        currentSearch: "",
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNext: false,
          hasPrev: false,
        },

        fetchApiKeys: async (page = 1, status = null, search = null) => {
          set({ loading: true, error: null });
          try {
            const params = {
              page: page,
              limit: 10,
            };

            const currentStatus = status || get().currentFilterStatus;
            const currentSearch = search || get().currentSearch;

            if (currentStatus && currentStatus !== "all") {
              params.status = currentStatus;
            }

            if (currentSearch) {
              params.search = currentSearch;
            }
            console.log(params);

            const response = await axiosInstance.get("/api", { params });

            const data = response.data?.data;
            set({
              apiKeys: data.keys || [],
              pagination: data.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                itemsPerPage: 10,
                hasNext: false,
                hasPrev: false,
              },
              loading: false,
            });
            return data;
          } catch (error) {
            set({
              error: error.response?.data?.message || error.message,
              loading: false,
            });
            throw error;
          }
        },

        changePage: (page) => {
          set({ pagination: { ...get().pagination, currentPage: page } });
          get().fetchApiKeys(page);
        },

        createApiKey: async (name, expiresAt = null) => {
          set({ loading: true, error: null });
          try {
            const payload = { name };
            if (expiresAt) {
              payload.expires_at = expiresAt;
            }

            const response = await axiosInstance.post("/api", payload);

            const data = response.data?.data;

            set((state) => ({
              apiKeys: [data, ...state.apiKeys],
              pagination: {
                ...state.pagination,
                totalItems: state.pagination.totalItems + 1,
              },
              loading: false,
            }));

            return data;
          } catch (error) {
            set({ 
              error: error.response?.data?.message || error.message,
              loading: false 
            });
            throw error;
          }
        },

        revokeApiKey: async (keyId) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.patch(`/api/${keyId}/revoke`);
            const data = response.data?.data;

            set((state) => ({
              apiKeys: state.apiKeys.map((key) =>
                key.id === keyId
                  ? { ...key, status: "revoked", revoked_at: data.revoked_at }
                  : key,
              ),
              loading: false,
            }));

            return data;
          } catch (error) {
            set({ 
              error: error.response?.data?.message || error.message,
              loading: false 
            });
            throw error;
          }
        },

        regenerateApiKey: async (keyId) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.post(
              `/api/${keyId}/regenerate`,
            );
            const data = response.data?.data;

            set((state) => ({
              apiKeys: state.apiKeys.map((key) =>
                key.id === keyId
                  ? {
                      ...key,
                      api_key: data.key,
                      prefix: data.prefix,
                      last_regenerated: data.last_regenerated,
                      api_secret_hash:data.api_secret_hash,
                      status: "active",
                    }
                  : key,
              ),
              loading: false,
            }));

            return data;
          } catch (error) {
            set({ 
              error: error.response?.data?.message || error.message,
              loading: false 
            });
            throw error;
          }
        },

        deleteApiKey: async (keyId) => {
          set({ loading: true, error: null });
          try {
            await axiosInstance.delete(`/api/${keyId}`);

            set((state) => ({
              apiKeys: state.apiKeys.filter((key) => key.id !== keyId),
              pagination: {
                ...state.pagination,
                totalItems: Math.max(0, state.pagination.totalItems - 1),
              },
              loading: false,
            }));

            return true;
          } catch (error) {
            set({ 
              error: error.response?.data?.message || error.message,
              loading: false 
            });
            throw error;
          }
        },

        updateApiKey: async (keyId, updates) => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.patch(
              `/api/${keyId}`,
              updates,
            );
            const data = response.data?.data;

            set((state) => ({
              apiKeys: state.apiKeys.map((key) =>
                key.id === keyId ? { ...key, ...data } : key,
              ),
              loading: false,
            }));

            return data;
          } catch (error) {
            set({ 
              error: error.response?.data?.message || error.message,
              loading: false 
            });
            throw error;
          }
        },

        getApiKeyUsage: async (keyId, period = "30d") => {
          set({ loading: true, error: null });
          try {
            const response = await axiosInstance.get(`/api/${keyId}/usage`, {
              params: { period },
            });

            return response.data?.data;
          } catch (error) {
            set({ error: error.response?.data?.message || error.message });
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        setCurrentFilterStatus: (status) => {
          set({ currentFilterStatus: status });
          get().fetchApiKeys(1);
        },

        setCurrentSearch: (search) => {
          set({ currentSearch: search });
          get().fetchApiKeys(1);
        },

        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),
        setLoading: (loading) => set({ loading }),

        getActiveKeysCount: () =>
          get().apiKeys.filter((key) => key.status === "active").length,
        getExpiredKeysCount: () =>
          get().apiKeys.filter((key) => key.status === "expired").length,
        getRevokedKeysCount: () =>
          get().apiKeys.filter((key) => key.status === "revoked").length,
      }),
      {
        name: "api-key-storage",
        partialize: (state) => ({
          apiKeys: state.apiKeys,
          pagination: state.pagination,
          currentFilterStatus: state.currentFilterStatus,
          currentSearch: state.currentSearch,
        }),
      },
    ),
    { name: "ApiKeyStore" },
  ),
);