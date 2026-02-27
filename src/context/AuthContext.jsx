//  React's built-in way to share data globally across all components without passing props 
//  manually

import { createContext, useContext, useState } from "react";

// 1. Create the context object
// This is like creating an empty "container" that will hold our auth data
const AuthContext = createContext(null);

// 2. AuthProvider — wraps the whole app and supplies auth data to every component
export function AuthProvider({ children }) {

  // Store the logged-in user object (null means no one is logged in)
  const [user, setUser] = useState(null);

  // Store loading state for when we're waiting on an API response
  const [loading, setLoading] = useState(false);

  // --- LOGIN function ---
  // Later this will make a POST request to your FastAPI /auth/login endpoint
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 🔧 TODO: Replace this mock with real API call when backend is ready
      // Example: const response = await axios.post("/api/auth/login", { email, password });
      
      // Mock user for now so we can build and test the UI
      const mockUser = {
        id: 1,
        name: "Gabriel Olatunji",
        email: email,
        location: "Lagos, Nigeria",
      };
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      // Always stop loading whether request succeeded or failed
      setLoading(false);
    }
  };

  // --- REGISTER function ---
  // Later this will POST to your FastAPI /auth/register endpoint
  const register = async (userData) => {
    setLoading(true);
    try {
      // 🔧 TODO: Replace mock with real API call
      // Example: const response = await axios.post("/api/auth/register", userData);

      const mockUser = {
        id: 2,
        name: userData.name,
        email: userData.email,
        location: userData.location,
      };
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOUT function ---
  const logout = () => {
    setUser(null);
    // 🔧 TODO: Also clear token from localStorage when backend is ready
  };

  // Everything inside `value` is what any component in the app can access
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — makes it easy to use auth in any component
// Instead of writing useContext(AuthContext) every time, just write useAuth()
export function useAuth() {
  return useContext(AuthContext);
}