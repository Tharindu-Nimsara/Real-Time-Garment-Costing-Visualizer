import { createContext, useContext, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Retrieve user from M.S.R. Apparels localStorage
    const saved = localStorage.getItem("msrapparels_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // ==========================================================
  // LOGIN FUNCTION
  // ==========================================================
  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await authAPI.login(email, password);
      const userData = {
        name: data.user?.name || data.name,
        email: data.user?.email || data.email,
        role: data.user?.role || "customer",
        id: data.user?._id || data._id,
      };

      localStorage.setItem("msrapparels_token", data.token);
      localStorage.setItem("msrapparels_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  // ==========================================================
  // REGISTER FUNCTION
  // ==========================================================
  const register = async (name, email, password) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { data } = await authAPI.register(name, email, password);
      const userData = {
        name: data.user?.name || data.name || name,
        email: data.user?.email || data.email || email,
        role: data.user?.role || "customer",
        id: data.user?._id || data._id,
      };

      localStorage.setItem("msrapparels_token", data.token);
      localStorage.setItem("msrapparels_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Please try again.";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  // ==========================================================
  // LOGOUT — no changes needed, works for both demo and real
  // ==========================================================
  const logout = () => {
    setUser(null);
    setAuthError("");
    // Remove M.S.R. Apparels tokens from localStorage
    localStorage.removeItem("msrapparels_token");
    localStorage.removeItem("msrapparels_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        authError,
        authLoading,
        isLoggedIn: !!user,
        clearAuthError: () => setAuthError(""),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
