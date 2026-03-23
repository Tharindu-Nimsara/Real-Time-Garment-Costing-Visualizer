import { createContext, useContext, useState } from "react";

// ============================================================
// TODO: WHEN BACKEND IS READY — uncomment this line below
// import { authAPI } from "../services/api";
// ============================================================

const AuthContext = createContext(null);

// ============================================================
// TODO: WHEN BACKEND IS READY — remove this entire DEMO_USERS
// array (lines below until the next TODO comment)
const DEMO_USERS = [
  { name: "Ashan Fernando", email: "admin@test.com",  password: "admin123", role: "Admin" },
  { name: "Dilini Perera",  email: "sales@test.com",  password: "sales123", role: "Sales" },
  { name: "Kamal Silva",    email: "sales2@test.com", password: "sales456", role: "Sales" },
];
// TODO: END OF DEMO_USERS — remove until here
// ============================================================

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

    // --------------------------------------------------------
    // DEMO LOGIN BLOCK (active)
    await new Promise((r) => setTimeout(r, 600)); // fake network delay

    const demoUser = DEMO_USERS.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (demoUser) {
      const userData = {
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        id: "demo",
      };
      // Set demo token for M.S.R. Apparels
      localStorage.setItem("msrapparels_token", "demo-token");
      localStorage.setItem("msrapparels_user", JSON.stringify(userData));
      setUser(userData);
      setAuthLoading(false);
      return { success: true };
    }

    setAuthError("Invalid email or password.");
    setAuthLoading(false);
    return { success: false };
    // --------------------------------------------------------

    /*
    // BACKEND LOGIN BLOCK (inactive)
    try {
      const { data } = await authAPI.login(email, password);
      const userData = {
        name: data.user?.name || data.name,
        email: data.user?.email || data.email,
        role: data.user?.role || "Sales",
        id: data.user?._id || data._id,
      };
      // Set login token for M.S.R. Apparels
      localStorage.setItem("msrapparels_token", data.token);
      localStorage.setItem("msrapparels_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
    */
    // --------------------------------------------------------
  };

  // ==========================================================
  // REGISTER FUNCTION
  // ==========================================================
  const register = async (name, email, password) => {
    setAuthLoading(true);
    setAuthError("");

    // --------------------------------------------------------
    // TODO: WHEN BACKEND IS READY — remove this entire block
    // (from here until the next TODO comment)
    await new Promise((r) => setTimeout(r, 600)); // fake network delay

    const exists = DEMO_USERS.find((u) => u.email === email.trim());
    if (exists) {
      setAuthError("Email already registered.");
      setAuthLoading(false);
      return { success: false };
    }

    const userData = { name, email, role: "Sales", id: "demo-" + Date.now() };
    // Set demo token for M.S.R. Apparels
    localStorage.setItem("msrapparels_token", "demo-token");
    localStorage.setItem("msrapparels_user", JSON.stringify(userData));
    setUser(userData);
    setAuthLoading(false);
    return { success: true };
    // TODO: END OF DEMO REGISTER BLOCK — remove until here
    // --------------------------------------------------------

    // --------------------------------------------------------
    // TODO: WHEN BACKEND IS READY — uncomment this block below
    // (remove the /* and */ to activate)
    /*
    try {
      const { data } = await authAPI.register(name, email, password);
      const userData = {
        name: data.user?.name || data.name || name,
        email: data.user?.email || data.email || email,
        role: data.user?.role || "Sales",
        id: data.user?._id || data._id,
      };
      // Set login token for M.S.R. Apparels
      localStorage.setItem("msrapparels_token", data.token);
      localStorage.setItem("msrapparels_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
    */
    // --------------------------------------------------------
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
    <AuthContext.Provider value={{
      user, login, register, logout,
      authError, authLoading,
      isLoggedIn: !!user,
      clearAuthError: () => setAuthError(""),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
