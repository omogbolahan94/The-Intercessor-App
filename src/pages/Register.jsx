import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// List of locations users can select from
// 🔧 You can expand this list or later load it dynamically from your FastAPI backend
const LOCATIONS = [
  "Nigeria", 
  "North America",
  "South America",
  "United Kingdom",
  "Europe",
  "West Africa",
  "East Africa",
  "South Africa",
  "Middle East",
  "South Asia",
  "Southeast Asia",
  "East Asia",
  "Australia & Oceania",
];

function Register() {
  // One state object to hold all form field values together
  const [formData, setFormData] = useState({
    name:     "",
    email:    "",
    password: "",
    confirm:  "",   // confirm password field
    location: "",
  });

  const [error, setError]     = useState("");
  const { register, loading } = useAuth();
  const navigate              = useNavigate();

  // Generic handler — updates whichever field changed using its `name` attribute
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation before hitting the API
    if (formData.password !== formData.confirm) {
      return setError("Passwords do not match.");
    }
    if (!formData.location) {
      return setError("Please select your location.");
    }

    const result = await register(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4 py-10">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">🙏 The Intercessor</h1>
          <p className="text-gray-500 mt-2">Create your account to get started.</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Gabriel Olatunji"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Location dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500
                         bg-white text-gray-700"
            >
              <option value="">-- Select your region --</option>
              {/* Dynamically render each location as an option */}
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              required
              value={formData.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white 
                       font-semibold py-2.5 rounded-lg transition duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        {/* Link back to login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
