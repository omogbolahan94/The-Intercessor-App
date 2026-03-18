function Footer() {
  return (
    <footer className="bg-[#18181B]">

      {/* ══════════════════════════════════════════
          BEHIND THE VISION
      ══════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span className="text-xs font-medium text-[#A1A1AA] uppercase tracking-widest">
                Behind the Vision
              </span>
            </div>

            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-3xl md:text-4xl font-semibold text-white leading-snug mb-4"
            >
              Built by someone who
              <br />
              <span className="text-white/60">believes in prayer</span>
            </h2>

            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-md">
              The Intercessors was built on a conviction that when believers come together in prayer,
               nothing is impossible (Matthew 18:19). I have personally witnessed the power of 
               intercession, and my desire is to make it practical for us as believers in Christ 
               to consistently pray for one another (James 5:16), irrespective of our location.
            </p>

            {/* <div className="w-8 h-px bg-[#7C3AED] mb-6" /> */}

            {/* Developer card */}
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#7C3AED]">
                  <img
                    src="https://ui-avatars.com/api/?name=Gabriel+Olatunji&background=EDE9FE&color=7C3AED&size=128&font-size=0.4"
                    alt="Gabriel Olatunji"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#18181B]" />
              </div>

              {/* Name + role + email */}
              <div>
                <p
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  className="text-lg font-semibold text-white"
                >
                  Gabriel Olatunji
                </p>
                <p className="text-xs text-[#71717A] mb-1">
                  Software, Data & AI Professional
                </p>

                {/* ✅ FIXED */}
                <a
                  href="mailto:gabrielomogbolahan1@gmail.com"
                  className="text-xs text-[#7C3AED] hover:text-white font-medium transition-colors duration-200"
                >
                  gabrielomogbolahan1@gmail.com
                </a>
              </div>
            </div>

            {/* Faith statement */}
            <div className="mt-6 pl-5 ">
              <p
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-base italic text-white/70 leading-snug"
              >
                "On Christ the solid rock I stand."
              </p>
              <p className="text-xs text-[#71717A] mt-1">
                Gabriel Olatunji, Creator of The Intercessors
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:grid grid-cols-2 gap-10">
            {/* Column 1 */}
            <div>
                <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-widest mb-5">
                Quick Links
                </p>
                <ul className="flex flex-col gap-3">
                {[
                    { label: "Home", to: "/" },
                    { label: "About", to: "/about" },
                    { label: "Prayer Feed", to: "/prayer-feed" },
                    { label: "Testimonies", to: "/testimonies" },
                    { label: "Dashboard", to: "/dashboard" },
                ].map((link) => (
                    <li key={link.label}>
                    <a
                        href={link.to}
                        className="text-sm text-[#71717A] hover:text-white transition-colors duration-200"
                    >
                        {link.label}
                    </a>
                    </li>
                ))}
                </ul>
            </div>

            {/* Column 2 */}
            <div>
                <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-widest mb-5">
                Connect
                </p>

                <ul className="flex flex-col gap-3">

                {/* Email */}
                <li>
                    <a
                    href="mailto:gabrielomogbolahan1@gmail.com"
                    className="flex items-center gap-2 text-sm text-[#71717A]
                                hover:text-white transition-colors duration-200"
                    >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2
                            0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0
                            002 2z" />
                    </svg>
                    Email Me
                    </a>
                </li>

                </ul>
            </div>
            </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <svg viewBox="0 0 28 28" fill="none" className="w-4 h-4 text-[#7C3AED]">
              <rect x="12" y="2" width="4" height="24" rx="1.5" fill="currentColor"/>
              <rect x="4" y="9" width="20" height="4" rx="1.5" fill="currentColor"/>
            </svg>
            <span
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-sm font-medium text-white"
            >
              The Intercessors
            </span>
          </div>

          <p className="text-xs text-[#71717A] text-center">
            © {new Date().getFullYear()} The Intercessors. Built with
            faith & love by{" "}
            <span className="text-[#A1A1AA] font-medium">
              Gabriel Olatunji
            </span>.
          </p>

          {/* ✅ FIXED */}
          <a
            href="mailto:gabrielomogbolahan1@gmail.com"
            className="text-xs text-[#71717A] hover:text-[#7C3AED] transition-colors duration-200"
          >
            gabrielomogbolahan1@gmail.com
          </a>

        </div>
      </div>

    </footer>
  );
}

export default Footer;