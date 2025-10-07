import axios from "axios";
import { API_ROOT } from "../utils/constants";

let api = axios.create({
  baseURL: API_ROOT,
  timeout: 1000 * 30,
});

// 📝 Thêm access token vào header cho mọi request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 📝 Xử lý token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if ([401, 403, 410].includes(status) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // chờ token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.warn("🚨 Không có refreshToken trong localStorage");
          throw new Error("No refresh token");
        }

        console.log("📤 Gọi refresh với chính access token:", refreshToken);

        const res = await axios.post(`${API_ROOT}auth/refresh`, {
          token: refreshToken,  // 👈 gửi chính access token lên
        });

        const newAccessToken = res.data.result.token;
        console.log("✅ Refresh thành công:", newAccessToken);

        // Cập nhật token mới vào localStorage
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newAccessToken); // 👈 giữ sync

        // Gọi lại tất cả request đang chờ
        processQueue(null, newAccessToken);

        // Retry request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("❌ Refresh thất bại:", err.response?.data || err);
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
