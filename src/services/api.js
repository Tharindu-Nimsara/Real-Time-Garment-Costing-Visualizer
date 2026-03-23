import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("msrapparels_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("msrapparels_token");
      localStorage.removeItem("msrapparels_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  register: (name, email, password) =>
    api.post("/api/users/register", { name, email, password }),

  login: (email, password) =>
    api.post("/api/users/login", { email, password }),
};

// ─── Quotes ──────────────────────────────────────────────
export const quotesAPI = {
  // Upload logo to Cloudinary — multipart/form-data
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append("logo", file);
    return api.post("/api/quotes/upload-logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Calculate & save quote
  calculate: (payload) => api.post("/api/quotes/calculate", payload),
};

// ─── Helpers ─────────────────────────────────────────────

// Map frontend garment type IDs → API productType enum
export const GARMENT_TYPE_MAP = {
  crewneck_tee:  "crewneckShortSleeves",
  crewneck_long: "crewneckLongSleeves",
  polo:          "poloCollar",
};

// Map frontend logo position → API placement enum
export const LOGO_PLACEMENT_MAP = {
  chest:  "left_chest",
  back:   "right_chest",
  sleeve: "left_chest",
  none:   "none",
};

export default api;
