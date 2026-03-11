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
                  ${isActive("/")
                    ? "text-[#7C3AED]"
                    : "text-[#52525B] hover:text-[#18181B]"}`}>
                Home
              </Link>

              <Link to="/about"
                className={`text-sm font-medium transition-colors duration-200
                  ${isActive("/about")
                    ? "text-[#7C3AED]"
                    : "text-[#52525B] hover:text-[#18181B]"}`}>
                About
              </Link>

              {user && (
                <>
                  <Link to="/dashboard"
                    className={`text-sm font-medium transition-colors duration-200
                      ${isActive("/dashboard")
                        ? "text-[#7C3AED]"
                        : "text-[#52525B] hover:text-[#18181B]"}`}>
                    Dashboard
                  </Link>
                  <Link to="/prayer-feed"
                    className={`text-sm font-medium transition-colors duration-200
                      ${isActive("/prayer-feed")
                        ? "text-[#7C3AED]"
                        : "text-[#52525B] hover:text-[#18181B]"}`}>
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
            { to: "/", label: "Home" },
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



// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState, useEffect } from "react";

// function Navbar() {
//   const { user, logout }  = useAuth();
//   const navigate          = useNavigate();
//   const location          = useLocation(); // Tells us the current URL path
//   const [menuOpen, setMenuOpen]   = useState(false);
//   const [scrolled, setScrolled]   = useState(false); // Tracks if user has scrolled

//   // ── Listen to scroll position ──
//   // When user scrolls past 20px, we add a shadow + solid background to the navbar
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     // Cleanup: remove listener when component unmounts to prevent memory leaks
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // ── Close mobile drawer when route changes ──
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   // Helper — returns true if the given path is the current page
//   // Used to highlight the active nav link
//   const isActive = (path) => location.pathname === path;

//   // Reusable style for desktop nav links
//   // Active links get a bottom border + brighter color
//   const desktopLinkClass = (path) =>
//     `relative text-sm font-medium tracking-wide transition-colors duration-200 pb-0.5
//      after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px]
//      after:bg-white after:transition-all after:duration-300
//      ${isActive(path)
//        ? "text-white after:w-full"
//        : "text-purple-200 hover:text-white after:w-0 hover:after:w-full"
//      }`;

//   return (
//     <>
//       {/* ── Main Navbar ── */}
//       <nav
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
//           ${scrolled
//             ? "bg-purple-900 shadow-[0_4px_30px_rgba(88,28,135,0.4)]"  // Solid on scroll
//             : "bg-purple-900/80 backdrop-blur-md"                        // Glassy at top
//           }`}
//       >
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="flex items-center justify-between h-16">

//             {/* ── Brand ── */}
//             <Link
//               to="/"
//               className="flex items-center gap-2.5 group"
//             >
//               {/* Icon container with a subtle glow on hover */}
//               <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
//                 🙏
//               </span>
//               <div className="flex flex-col leading-none">
//                 <span className="text-white font-bold text-lg tracking-tight">
//                   The Intercessor
//                 </span>
//                 {/* Subtle tagline under the brand name */}
//                 <span className="text-purple-300 text-[10px] tracking-widest uppercase">
//                   Global Community
//                 </span>
//               </div>
//             </Link>

//             {/* ── Desktop Links ── */}
//             <div className="hidden md:flex items-center gap-8">
//               <Link to="/" className={desktopLinkClass("/")}>Home</Link>

//               {user && (
//                 <>
//                   <Link to="/dashboard"   className={desktopLinkClass("/dashboard")}>
//                     Dashboard
//                   </Link>
//                   <Link to="/prayer-feed" className={desktopLinkClass("/prayer-feed")}>
//                     Prayer Feed
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* ── Desktop Auth Area ── */}
//             <div className="hidden md:flex items-center gap-3">

//               {!user ? (
//                 <>
//                   {/* Ghost button for Sign In */}
//                   <Link
//                     to="/login"
//                     className="text-sm font-medium text-purple-200 hover:text-white 
//                                transition-colors duration-200 px-4 py-2"
//                   >
//                     Sign In
//                   </Link>

//                   {/* Solid CTA button for Join */}
//                   <Link
//                     to="/register"
//                     className="text-sm font-semibold bg-white text-purple-900 
//                                px-5 py-2 rounded-full hover:bg-purple-100 
//                                transition-all duration-200 shadow-md 
//                                hover:shadow-purple-300/50 hover:shadow-lg"
//                   >
//                     Join Free →
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   {/* User avatar pill — shows initials */}
//                   <div className="flex items-center gap-3 bg-purple-800/60 
//                                   rounded-full pl-1 pr-4 py-1 border border-purple-600">
//                     {/* Avatar circle with user's initials */}
//                     <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center 
//                                     justify-center text-white text-xs font-bold">
//                       {/* Take first letter of first and last name */}
//                       {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
//                     </div>
//                     <span className="text-white text-sm font-medium">
//                       {user.name.split(" ")[0]}
//                     </span>
//                   </div>

//                   {/* Logout — styled as a subtle danger link */}
//                   <button
//                     onClick={handleLogout}
//                     className="text-sm font-medium text-purple-300 hover:text-red-300 
//                                transition-colors duration-200 px-3 py-2"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* ── Mobile Menu Button ── */}
//             <button
//               className="md:hidden p-2 rounded-lg hover:bg-purple-700 transition-colors"
//               onClick={() => setMenuOpen(!menuOpen)}
//               aria-label="Toggle navigation menu"
//             >
//               {/* Animated icon: hamburger → X */}
//               <div className="w-5 h-4 flex flex-col justify-between">
//                 <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 
//                                   ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
//                 <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 
//                                   ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
//                 <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 
//                                   ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
//               </div>
//             </button>

//           </div>
//         </div>
//       </nav>

//       {/* ── Spacer ── */}
//       {/* Prevents page content from hiding behind the fixed navbar */}
//       <div className="h-16" />

//       {/* ── Mobile Drawer Overlay ── */}
//       {/* Dark backdrop behind the drawer — click it to close */}
//       {menuOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
//           onClick={() => setMenuOpen(false)}
//         />
//       )}

//       {/* ── Mobile Drawer Panel ── */}
//       {/* Slides in from the right side of the screen */}
//       <div
//         className={`fixed top-0 right-0 h-full w-72 z-50 bg-purple-900 
//                     shadow-2xl transform transition-transform duration-300 ease-in-out
//                     md:hidden flex flex-col
//                     ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* Drawer header */}
//         <div className="flex items-center justify-between px-6 py-5 
//                         border-b border-purple-700">
//           <span className="text-white font-bold text-lg">🙏 The Intercessor</span>
//           <button
//             onClick={() => setMenuOpen(false)}
//             className="text-purple-300 hover:text-white transition-colors p-1"
//             aria-label="Close menu"
//           >
//             {/* Close X icon built with CSS */}
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Drawer nav links */}
//         <div className="flex flex-col px-6 py-6 gap-1 flex-1">

//           {/* Mobile link style — full-width with hover highlight */}
//           {[
//             { to: "/", label: "Home" },
//             ...(user
//               ? [
//                   { to: "/dashboard",   label: "Dashboard" },
//                   { to: "/prayer-feed", label: "Prayer Feed" },
//                 ]
//               : []),
//           ].map(({ to, label }) => (
//             <Link
//               key={to}
//               to={to}
//               className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
//                 ${isActive(to)
//                   ? "bg-purple-700 text-white"
//                   : "text-purple-200 hover:bg-purple-800 hover:text-white"
//                 }`}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>

//         {/* Drawer footer — auth buttons */}
//         <div className="px-6 py-6 border-t border-purple-700">

//           {!user ? (
//             <div className="flex flex-col gap-3">
//               <Link
//                 to="/login"
//                 className="text-center text-sm font-medium text-purple-200 
//                            hover:text-white py-2.5 rounded-xl border border-purple-600
//                            hover:border-purple-400 transition-colors duration-200"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 to="/register"
//                 className="text-center text-sm font-semibold bg-white text-purple-900 
//                            py-2.5 rounded-xl hover:bg-purple-100 transition-colors duration-200"
//               >
//                 Join Free →
//               </Link>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-3">
//               {/* User info row */}
//               <div className="flex items-center gap-3 px-2">
//                 <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center 
//                                 justify-center text-white text-sm font-bold flex-shrink-0">
//                   {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
//                 </div>
//                 <div>
//                   <p className="text-white text-sm font-semibold">{user.name}</p>
//                   <p className="text-purple-400 text-xs">{user.email}</p>
//                 </div>
//               </div>
//               {/* Logout */}
//               <button
//                 onClick={handleLogout}
//                 className="text-sm font-medium text-red-300 hover:text-red-200 
//                            py-2.5 rounded-xl hover:bg-red-900/30 transition-colors 
//                            duration-200 text-left px-4"
//               >
//                 Sign Out
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }

// export default Navbar;