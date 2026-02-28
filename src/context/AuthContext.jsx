import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [hasPrayers, setHasPrayers] = useState(false);

  // Tracks the logged-in user's personal stats
  // 🔧 TODO: Fetch from GET /api/users/me/stats when backend is ready
  const [userStats, setUserStats] = useState({
    prayersSubmitted:  0,
    prayersInterceded: 0,
    testimoniesShared: 0,
  });

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 🔧 TODO: Replace with real API call
      // const res = await axios.post("/api/auth/login", { email, password });
      const mockUser = {
        id:       1,
        name:     "John Doe",
        email:    email,
        location: "Lagos, Nigeria",
      };
      setUser(mockUser);

      // 🔧 TODO: Replace mock stats with real data from API response
      setUserStats({
        prayersSubmitted:  4,
        prayersInterceded: 12,
        testimoniesShared: 1,
      });
      setHasPrayers(true); // Mock: this user already has prayers

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // 🔧 TODO: Replace with real API call
      const mockUser = {
        id:       2,
        name:     userData.name,
        email:    userData.email,
        location: userData.location,
      };
      setUser(mockUser);
      // Brand new user starts with zeroes
      setUserStats({ prayersSubmitted: 0, prayersInterceded: 0, testimoniesShared: 0 });
      setHasPrayers(false);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setHasPrayers(false);
    setUserStats({ prayersSubmitted: 0, prayersInterceded: 0, testimoniesShared: 0 });
    // 🔧 TODO: Clear token from localStorage when backend is ready
  };

  // Called after user successfully submits a prayer request
  const markHasPrayers = () => {
    setHasPrayers(true);
    setUserStats((prev) => ({
      ...prev,
      prayersSubmitted: prev.prayersSubmitted + 1,
    }));
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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}