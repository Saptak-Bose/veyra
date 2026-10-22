import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const initializeAuthInterceptor = (
  getToken: () => Promise<string | null>,
) =>
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error retrieving Clerk token via interceptor", error);
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
