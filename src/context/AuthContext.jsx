import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // -------------------- LOGIN --------------------
  const loginUser = async (email, password, role = "user") => {
    try {
      const url =
          role === "admin"
              ? `${API_URL}/api/auth/admin-login`
              : `${API_URL}/api/auth/login`;

      const res = await axios.post(
          url,
          { email, password },
          { withCredentials: true }
      );

      if (res.data?.user) {
        setUser(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
        return { success: true, user: res.data.user };
      } else {
        return { success: false, msg: "Login failed" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, msg: err.response?.data?.msg || "Login failed" };
    }
  };

  // -------------------- LOGOUT --------------------
  const logoutUser = async () => {
    try {
      if (!user) return;

      const url =
          user.role === "admin"
              ? `${API_URL}/api/auth/admin-logout`
              : `${API_URL}/api/auth/logout`;

      await axios.post(url, {}, { withCredentials: true });
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // -------------------- CHECK SESSION --------------------
  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });

      if (res.data?.user) {
        setUser(res.data.user);
        setIsAdmin(res.data.user.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Run session check on mount
  useEffect(() => {
    checkSession();
  }, []);

  return (
      <AuthContext.Provider
          value={{
            user,
            isAdmin,
            loading,
            loginUser,
            logoutUser,
            checkSession,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

// -------------------- CUSTOM HOOK --------------------
export const useAuth = () => useContext(AuthContext);
