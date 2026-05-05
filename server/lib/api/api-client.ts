import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, clearToken } from "../helpers";

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return getToken();
};

// console.log(getToken())

// -----------------------------
// AXIOS INSTANCE
// -----------------------------
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "", // safe fallback
  withCredentials: false,
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    config.headers = config.headers ?? {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      config.method &&
      config.method.toLowerCase() !== "get" &&
      !config.headers["Content-Type"]
    ) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// -----------------------------
// RESPONSE INTERCEPTOR (IMPORTANT)
// -----------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // optional: auto logout or token refresh hook
      console.warn("Unauthorized - token may be invalid/expired");
      clearToken();
    }

    return Promise.reject(error);
  },
);

// -----------------------------
// HELPERS
// -----------------------------
export async function authorizedFetch<T = any>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<{ res: AxiosResponse<T>; data: T }> {
  const res = await apiClient.request<T>({
    url,
    ...config,
  });

  return { res, data: res.data };
}

export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<TBody = any, TResp = any>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig,
): Promise<TResp> {
  const res = await apiClient.post<TResp>(url, body, config);
  return res.data;
}

export async function patch<TBody = any, TResp = any>(
  url: string,
  body: TBody,
  config?: AxiosRequestConfig,
): Promise<TResp> {
  const res = await apiClient.patch<TResp>(url, body, config);
  return res.data;
}

export async function del<TResp = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResp> {
  const res = await apiClient.delete<TResp>(url, config);
  return res.data;
}

export default apiClient;
