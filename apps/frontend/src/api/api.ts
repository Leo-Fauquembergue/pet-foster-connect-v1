// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Routes qui ne doivent PAS déclencher de redirection automatique
const NO_REDIRECT_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/signin",
  "/auth/signup",
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Ne pas rediriger si la requête concerne l'authentification
    const isAuthRoute = NO_REDIRECT_ROUTES.some((route) =>
      requestUrl.includes(route)
    );

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    const currentPath = window.location.pathname;
    console.log("Interceptor triggered", status, requestUrl, error.response);
    if (status === 401 && currentPath !== "/unauthorized") {
      window.location.replace("/unauthorized");
    } else if (status === 403 && currentPath !== "/forbidden") {
      window.location.replace("/forbidden");
    }

    return Promise.reject(error);
  }
);

export default api;
