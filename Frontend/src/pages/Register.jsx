import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🔧 TODO: These can be fetched from GET /api/locations
const LOCATIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "United Kingdom",
  "Europe",
  "North America",
  "South America",
  "South Asia",
  "East Asia",
  "Middle East",
  "Australia & Pacific",
  "Global / Other",
];

function Register() {
  const { register }                    = useAuth();
  const navigate                        = useNavigate();
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [location, setLocation]         = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pw) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    if (pw.length < 6)  return { label: "Too short", color: "bg-red-400",   width: "25%" };
    if (pw.length < 8)  return { label: "Weak",      color: "bg-orange-400", width: "50%" };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
                        return { label: "Fair",       color: "bg-yellow-400", width: "75%" };
    return               { label: "Strong",    color: "bg-green-500",  width: "100%" };
  };
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!location) {
      setError("Please select your region.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, location);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable eye toggle button
  const EyeToggle = ({ visible, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-[#A1A1AA] hover:text-[#52525B] transition-colors"
      aria-label={visible ? "Hide" : "Show"}
    >
      {visible ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943
               -9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243
               4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532
               7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5
               c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132
               5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
               9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943
               -9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════════════
          LEFT PANEL — Dark atmospheric side
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#18181B] flex-col
                      justify-between overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=900&q=80"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b
                          from-[#18181B]/60 via-transparent to-[#18181B]/90" />
        </div>

        {/* Brand mark */}
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

        {/* Bottom content */}
        <div className="relative z-10 p-10">

          {/* Social proof — community stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { number: "10k+",  label: "Prayer requests" },
              { number: "150+",  label: "Countries" },
              { number: "50k+",  label: "Answered prayers" },
              { number: "Free",  label: "Always & forever" },
            ].map((stat) => (
              <div key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/10
                           rounded-xl px-4 py-3">
                <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-white text-2xl font-semibold leading-none mb-1">
                  {stat.number}
                </p>
                <p className="text-white/50 text-xs uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-3xl font-semibold leading-snug">
            {/* Main line — bright white, slight text shadow for legibility */}
            <span className="text-white"
              style={{textShadow: "0 2px 12px rgba(0,0,0,0.8)"}}>
              Join the community
            </span>
            <br />
            {/* Second line — softly lit, not dim */}
            <span className="text-white/80 text-sm"
              style={{textShadow: "0 2px 12px rgba(0,0,0,0.8)"}}>
              Thousands are praying with you
            </span>
          </h2>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Clean white form
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center
                      px-8 sm:px-16 py-12 bg-white overflow-y-auto">

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
              Create Account
            </h1>
            <p className="text-sm text-[#A1A1AA]">
              Already have an account?{" "}
              <Link to="/login"
                className="text-[#7C3AED] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error */}
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

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B]
                                uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                           text-sm text-[#18181B] placeholder:text-[#A1A1AA]
                           transition-colors duration-200"
              />
            </div>

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

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B]
                                uppercase tracking-wider mb-2">
                Your Region
              </label>
              <div className="relative">
                <select
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                             text-sm text-[#18181B] bg-white appearance-none
                             transition-colors duration-200 cursor-pointer
                             pr-10"
                >
                  <option value="" disabled>Select your region...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {/* Custom chevron */}
                <div className="pointer-events-none absolute right-3
                                top-1/2 -translate-y-1/2 text-[#A1A1AA]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B]
                                uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                             pr-11 text-sm text-[#18181B]
                             placeholder:text-[#A1A1AA]
                             transition-colors duration-200"
                />
                <EyeToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-[#E4E4E7] rounded-full
                                  overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all
                                  duration-300 ${strength.color}`}
                      style={{width: strength.width}}
                    />
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">
                    Strength:{" "}
                    <span className="font-medium text-[#52525B]">
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#18181B]
                                uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full border rounded-lg px-4 py-3 pr-11
                              text-sm text-[#18181B]
                              placeholder:text-[#A1A1AA]
                              transition-colors duration-200
                              ${confirmPassword && confirmPassword !== password
                                ? "border-red-300 bg-red-50"
                                : confirmPassword && confirmPassword === password
                                ? "border-green-300"
                                : "border-[#E4E4E7]"
                              }`}
                />
                <EyeToggle
                  visible={showConfirm}
                  onToggle={() => setShowConfirm(!showConfirm)}
                />
              </div>
              {/* Match indicator */}
              {confirmPassword && (
                <p className={`text-[11px] mt-1
                  ${confirmPassword === password
                    ? "text-green-600"
                    : "text-red-500"}`}>
                  {confirmPassword === password
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* Footer note */}
          <p className="text-xs text-[#A1A1AA] text-center mt-8 leading-relaxed">
            By creating an account you agree to our{" "}
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

export default Register;