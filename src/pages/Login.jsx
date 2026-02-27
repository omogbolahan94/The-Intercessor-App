import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  // Local state to track what the user types into the form
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");   // show error messages

  // Pull login function and loading state from our global Auth Context
  const { login, loading } = useAuth();

  // useNavigate lets us redirect the user after successful login
  const navigate = useNavigate();

  // Runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh (default form behaviour)
    setError("");        // Clear any previous errors

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard"); // Redirect to dashboard on success
    } else {
      setError(result.message || "Login failed. Please try again.");
    }
  };

  return (
    // Full-height centered layout with a soft purple background
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">

      {/* Card container */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">🙏 The Intercessor</h1>
          <p className="text-gray-500 mt-2">Welcome back. Sign in to continue.</p>
        </div>

        {/* Error message — only visible when error state is not empty */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit button — shows loading text while request is in progress */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white 
                       font-semibold py-2.5 rounded-lg transition duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* Link to Register page */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-purple-700 font-medium hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;