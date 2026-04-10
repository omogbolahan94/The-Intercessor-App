// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser]           = useState(null);
//   const [loading, setLoading]     = useState(false);
//   const [hasPrayers, setHasPrayers] = useState(false);

//   // Tracks the logged-in user's personal stats
//   // 🔧 TODO: Fetch from GET /api/users/me/stats when backend is ready
//   const [userStats, setUserStats] = useState({
//     prayersSubmitted:  0,
//     prayersInterceded: 0,
//     testimoniesShared: 0,
//   });

//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       // 🔧 TODO: Replace with real API call
//       // const res = await axios.post("/api/auth/login", { email, password });
//       const mockUser = {
//         id:       1,
//         name:     "John Doe",
//         email:    email,
//         location: "Lagos, Nigeria",
//       };
//       setUser(mockUser);

//       // 🔧 TODO: Replace mock stats with real data from API response
//       setUserStats({
//         prayersSubmitted:  4,
//         prayersInterceded: 12,
//         testimoniesShared: 1,
//       });
//       setHasPrayers(true); // Mock: this user already has prayers

//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (userData) => {
//     setLoading(true);
//     try {
//       // 🔧 TODO: Replace with real API call
//       const mockUser = {
//         id:       2,
//         name:     userData.name,
//         email:    userData.email,
//         location: userData.location,
//       };
//       setUser(mockUser);
//       // Brand new user starts with zeroes
//       setUserStats({ prayersSubmitted: 0, prayersInterceded: 0, testimoniesShared: 0 });
//       setHasPrayers(false);
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setHasPrayers(false);
//     setUserStats({ prayersSubmitted: 0, prayersInterceded: 0, testimoniesShared: 0 });
//     // 🔧 TODO: Clear token from localStorage when backend is ready
//   };

//   // Called after user successfully submits a prayer request
//   const markHasPrayers = () => {
//     setHasPrayers(true);
//     setUserStats((prev) => ({
//       ...prev,
//       prayersSubmitted: prev.prayersSubmitted + 1,
//     }));
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       hasPrayers,
//       userStats,
//       login,
//       register,
//       logout,
//       markHasPrayers,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }


import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);   // true while checking token on load
  const [hasPrayers, setHasPrayers] = useState(false);

  // ── On app load — restore session from token ──────────────
  // If a token exists in localStorage, fetch the user profile
  // so the user stays logged in after a page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data);
        setHasPrayers((res.data.stats?.prayers_submitted ?? 0) > 0);
      })
      .catch(() => {
        // Token is invalid or expired — clear it
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token } = res.data;
      localStorage.setItem("token", access_token);
      const profileRes = await api.get("/auth/me");
      setUser(profileRes.data);
      setHasPrayers((profileRes.data.stats?.prayers_submitted ?? 0) > 0);
    } catch (err) {
      // Re-throw with a small delay so React fully commits
      // the loading=false render before the error render
      await new Promise((resolve) => setTimeout(resolve, 50));
      throw err;
    }
  };

  // ── Register ───────────────────────────────────────────────
  const register = async (name, email, password, location, date_of_birth = null) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      location,
      date_of_birth,
    });
    const { access_token } = res.data;

    localStorage.setItem("token", access_token);

    // Fetch full user profile after registration
    const profileRes = await api.get("/auth/me");
    setUser(profileRes.data);
    setHasPrayers(false); // brand new user has no prayers yet
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setHasPrayers(false);
  };

  // ── Called after a prayer is submitted ────────────────────
  // Flips hasPrayers to true so testimony button unlocks
  const markHasPrayers = () => setHasPrayers(true);

  // ── User stats helper ──────────────────────────────────────
  const userStats = {
    prayersSubmitted: user?.stats?.prayers_submitted   ?? 0,
    prayersAnswered:  user?.stats?.prayers_answered    ?? 0,
    intercessions:    user?.stats?.intercessions_made  ?? 0,
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setHasPrayers((res.data.stats?.prayers_submitted ?? 0) > 0);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      hasPrayers,
      userStats,
      login,
      register,
      logout,
      markHasPrayers,
      refreshUser,
    }}>
      {/* Don't render children until we know if user is logged in */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);