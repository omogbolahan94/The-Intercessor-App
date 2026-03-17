import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function Navbar() {
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const location                      = useLocation();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300
                       ${scrolled ? "shadow-[0_1px_0_0_#E4E4E7]" : ""}`}>

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Brand ── */}
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Simple cross icon as brand mark */}
              <div className="w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 28 28" fill="none"
                  className="w-6 h-6 text-[#7C3AED]">
                  <rect x="12" y="2" width="4" height="24" rx="1.5"
                    fill="currentColor"/>
                  <rect x="4" y="9" width="20" height="4" rx="1.5"
                    fill="currentColor"/>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-[#18181B] font-semibold text-lg tracking-tight">
                  The Intercessors
                </span>
              </div>
            </Link>

            {/* ── Desktop Links ── */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/"
                className={`text-sm font-medium transition-colors duration-200
                  ${isActive("/") ? "text-[#7C3AED]" : "text-[#52525B] hover:text-[#18181B]"}`}>
                Home
              </Link>
              <Link to="/about"
                className={`text-sm font-medium transition-colors duration-200
                  ${isActive("/about") ? "text-[#7C3AED]" : "text-[#52525B] hover:text-[#18181B]"}`}>
                About
              </Link>
              <Link to="/testimonies"
                className={`text-sm font-medium transition-colors duration-200
                  ${isActive("/testimonies") ? "text-[#7C3AED]" : "text-[#52525B] hover:text-[#18181B]"}`}>
                Testimonies
              </Link>
              {user && (
                <>
                  <Link to="/dashboard"
                    className={`text-sm font-medium transition-colors duration-200
                      ${isActive("/dashboard") ? "text-[#7C3AED]" : "text-[#52525B] hover:text-[#18181B]"}`}>
                    Dashboard
                  </Link>
                  <Link to="/prayer-feed"
                    className={`text-sm font-medium transition-colors duration-200
                      ${isActive("/prayer-feed") ? "text-[#7C3AED]" : "text-[#52525B] hover:text-[#18181B]"}`}>
                    Prayer Feed
                  </Link>
                </>
              )}
            </div>

            {/* ── Desktop Auth ── */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link to="/login"
                    className="text-sm font-medium text-[#52525B]
                               hover:text-[#18181B] transition-colors px-4 py-2">
                    Sign In
                  </Link>
                  <Link to="/register"
                    className="text-sm font-semibold text-white px-5 py-2
                               rounded-lg transition-all duration-200
                               bg-[#7C3AED] hover:bg-[#5B21B6] shadow-sm">
                    Join Free
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  {/* User initials badge */}
                  <div className="flex items-center gap-2.5 pl-1 pr-3 py-1
                                  border border-[#E4E4E7] rounded-full">
                    <div className="w-6 h-6 rounded-full bg-[#EDE9FE] flex items-center
                                    justify-center text-[#7C3AED] text-[11px] font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[#18181B]">
                      {user.name.split(" ")[0]}
                    </span>
                  </div>
                  <button onClick={handleLogout}
                    className="text-sm font-medium text-[#A1A1AA]
                               hover:text-red-500 transition-colors px-2 py-2">
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#FAFAFA] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-px bg-[#18181B] transition-all duration-300
                                  ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block h-px bg-[#18181B] transition-all duration-300
                                  ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-px bg-[#18181B] transition-all duration-300
                                  ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
              </div>
            </button>

          </div>
        </div>

        {/* ── Thin bottom border — only shows on scroll ── */}
        {scrolled && <div className="h-px bg-[#E4E4E7]" />}
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* ── Mobile overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setMenuOpen(false)} />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`fixed top-0 right-0 h-full w-72 z-50 bg-white
                       shadow-2xl transform transition-transform duration-300
                       md:hidden flex flex-col
                       ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-16
                        border-b border-[#E4E4E7]">
          <span style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-[#18181B] font-semibold text-lg">
            The Intercessors
          </span>
          <button onClick={() => setMenuOpen(false)}
            className="p-1 text-[#A1A1AA] hover:text-[#18181B] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex flex-col px-4 py-4 gap-1 flex-1">
                  {[
            { to: "/",             label: "Home" },
            { to: "/about",        label: "About" },
            { to: "/testimonies",  label: "Testimonies" },   // ← ADD
            ...(user ? [
              { to: "/dashboard",   label: "Dashboard" },
              { to: "/prayer-feed", label: "Prayer Feed" },
            ] : []),
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive(to)
                  ? "bg-[#EDE9FE] text-[#7C3AED]"
                  : "text-[#52525B] hover:bg-[#FAFAFA] hover:text-[#18181B]"}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="px-4 py-6 border-t border-[#E4E4E7]">
          {!user ? (
            <div className="flex flex-col gap-2">
              <Link to="/login"
                className="text-center text-sm font-medium text-[#52525B]
                           py-2.5 rounded-lg border border-[#E4E4E7]
                           hover:border-[#7C3AED] hover:text-[#7C3AED]
                           transition-colors">
                Sign In
              </Link>
              <Link to="/register"
                className="text-center text-sm font-semibold text-white
                           py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#5B21B6]
                           transition-colors">
                Join Free
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center
                                justify-center text-[#7C3AED] text-xs font-semibold">
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#18181B]">{user.name}</p>
                  <p className="text-xs text-[#A1A1AA]">{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="text-sm font-medium text-[#A1A1AA] hover:text-red-500
                           transition-colors text-left px-1 py-1">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;