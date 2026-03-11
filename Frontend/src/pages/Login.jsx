import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login }                   = useAuth();
  const navigate                    = useNavigate();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════════════
          LEFT PANEL — Dark atmospheric side
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#18181B] flex-col
                      justify-between overflow-hidden">

        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=900&q=80"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          {/* Dark gradient top to bottom */}
          <div className="absolute inset-0 bg-gradient-to-b
                          from-[#18181B]/60 via-transparent to-[#18181B]/90" />
        </div>

        {/* Brand mark — top left */}
        <div className="relative z-10 p-10">
          <Link to="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 28 28" fill="none"
              className="w-6 h-6 text-white">
              <rect x="12" y="2" width="4" height="24" rx="1.5"
                fill="currentColor"/>
              <rect x="4" y="9" width="20" height="4" rx="1.5"
                fill="currentColor"/>
            </svg>
            <span style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-white font-semibold text-lg tracking-tight">
              The Intercessors
            </span>
          </Link>
        </div>

        {/* Bottom content — scripture + tagline */}
        <div className="relative z-10 p-10">

          {/* Scripture card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20
                          rounded-2xl p-6 mb-8">
            <p style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-white text-xl font-medium italic leading-snug mb-3">
              "Do not be anxious about anything, but in every situation,
              by prayer and petition, with thanksgiving, present your
              requests to God."
            </p>
            <p className="text-[#7C3AED] text-xs font-medium uppercase
                          tracking-widest">
              Philippians 4:6
            </p>
          </div>

          {/* Tagline */}
          <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-white text-3xl font-semibold leading-snug">
            Welcome back.<br />
            <span className="text-white/60">The community is praying.</span>
          </h2>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Clean white form
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center
                      px-8 sm:px-16 py-12 bg-white">

        {/* Mobile brand mark */}
        <div className="lg:hidden mb-10">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 28 28" fill="none"
              className="w-6 h-6 text-[#7C3AED]">
              <rect x="12" y="2" width="4" height="24" rx="1.5"
                fill="currentColor"/>
              <rect x="4" y="9" width="20" height="4" rx="1.5"
                fill="currentColor"/>
            </svg>
            <span style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-[#18181B] font-semibold text-lg">
              The Intercessors
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">

          {/* Heading */}
          <div className="mb-8">
            <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-4xl font-semibold text-[#18181B] mb-2">
              Sign In
            </h1>
            <p className="text-sm text-[#A1A1AA]">
              Don't have an account?{" "}
              <Link to="/register"
                className="text-[#7C3AED] font-medium hover:underline">
                Create one free
              </Link>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg
                            px-4 py-3 flex items-start gap-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B]
                                uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                           text-sm text-[#18181B] placeholder:text-[#A1A1AA]
                           transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#18181B]
                                  uppercase tracking-wider">
                  Password
                </label>
                <button type="button"
                  className="text-xs text-[#7C3AED] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                             pr-11 text-sm text-[#18181B]
                             placeholder:text-[#A1A1AA]
                             transition-colors duration-200"
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-[#A1A1AA] hover:text-[#52525B] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478
                           0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029
                           m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242
                           4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29
                           M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0
                           8.268 2.943 9.543 7a10.025 10.025 0 01-4.132
                           5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0
                           8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542
                           7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                         text-sm font-semibold py-3 rounded-lg
                         transition-colors duration-200 shadow-sm
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none"
                    viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-[#E4E4E7]" />
            <span className="text-xs text-[#A1A1AA]">or</span>
            <div className="flex-1 h-px bg-[#E4E4E7]" />
          </div>

          {/* Create account CTA */}
          <Link to="/register"
            className="w-full flex items-center justify-center
                       border border-[#E4E4E7] text-[#18181B]
                       hover:border-[#18181B] text-sm font-semibold
                       py-3 rounded-lg transition-colors duration-200">
            Create a Free Account
          </Link>

          {/* Footer note */}
          <p className="text-xs text-[#A1A1AA] text-center mt-8 leading-relaxed">
            By signing in you agree to our{" "}
            <span className="text-[#52525B] hover:text-[#18181B]
                             cursor-pointer transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#52525B] hover:text-[#18181B]
                             cursor-pointer transition-colors">
              Privacy Policy
            </span>
            .
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;