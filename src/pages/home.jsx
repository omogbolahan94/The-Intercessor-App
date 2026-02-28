import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// ─────────────────────────────────────────
// FEATURES DATA
// ─────────────────────────────────────────
const FEATURES = [
  {
    icon: "🙏",
    title: "Submit Prayer Requests",
    description:
      "Share your prayer needs with a caring global community. Your request reaches believers across the world.",
  },
  {
    icon: "🌍",
    title: "Connect by Location",
    description:
      "Filter prayers by region and connect with believers who share your cultural and geographical background.",
  },
  {
    icon: "📖",
    title: "Daily Scripture",
    description:
      "Receive personalised Bible scripture recommendations based on your prayer requests every single day.",
  },
  {
    icon: "🤝",
    title: "Pray for Others",
    description:
      "Browse the prayer feed and intercede for fellow community members around the globe.",
  },
];

// ─────────────────────────────────────────
// MOCK TESTIMONIES
// These simulate real data from your database.
// 🔧 TODO: Replace with GET /api/testimonies when backend is ready
// ─────────────────────────────────────────
const MOCK_TESTIMONIES = [
  {
    id: 1,
    name: "Anonymous",
    location: "West Africa",
    date: "Feb 2025",
    testimony:
      "I prayed for my job situation for months. The community prayed with me and within two weeks I received a job offer beyond what I imagined. God is faithful!",
    isAnonymous: true,
  },
  {
    id: 2,
    name: "Grace M.",
    location: "United Kingdom",
    date: "Jan 2025",
    testimony:
      "My son was hospitalised and the doctors had no clear answers. I shared my request here and felt the power of collective prayer. He was discharged healthy three days later. Thank you all.",
    isAnonymous: false,
  },
  {
    id: 3,
    name: "Anonymous",
    location: "South Asia",
    date: "Jan 2025",
    testimony:
      "I was struggling with deep depression and felt completely alone. The prayers and scriptures I received through this platform gave me the strength to seek help. I am doing so much better now.",
    isAnonymous: true,
  },
  {
    id: 4,
    name: "Emmanuel O.",
    location: "East Africa",
    date: "Dec 2024",
    testimony:
      "We prayed for rain during a severe drought in our community. The rains came. Our church is testimony to the power of unified prayer across borders.",
    isAnonymous: false,
  },
  {
    id: 5,
    name: "Sarah K.",
    location: "North America",
    date: "Feb 2025",
    testimony:
      "After years of trying, we were blessed with a child. This community stood with us in prayer through every difficult moment. We are forever grateful.",
    isAnonymous: false,
  },
  {
    id: 6,
    name: "Anonymous",
    location: "Europe",
    date: "Dec 2024",
    testimony:
      "My marriage was on the verge of collapse. I prayed quietly here without telling anyone. Slowly things changed. We are still together and healing.",
    isAnonymous: true,
  },
];

// ─────────────────────────────────────────
// TESTIMONY CARD COMPONENT
// Renders a single testimony — visible to everyone
// ─────────────────────────────────────────
function TestimonyCard({ testimony }) {
  // Controls whether a long testimony is fully shown or truncated
  const [expanded, setExpanded] = useState(false);

  const isLong      = testimony.testimony.length > 180;
  const displayText = isLong && !expanded
    ? testimony.testimony.slice(0, 180) + "..."
    : testimony.testimony;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100
                    hover:shadow-md hover:border-purple-200 transition-all duration-200
                    flex flex-col gap-4">

      {/* Decorative opening quote mark */}
      <span className="text-5xl text-purple-200 font-serif leading-none">"</span>

      {/* Testimony text */}
      <p className="text-gray-600 text-sm leading-relaxed -mt-3">
        {displayText}
        {/* Read more / less toggle — only for long testimonies */}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-purple-600 hover:text-purple-800 text-xs
                       font-semibold transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      {/* Card footer — author info */}
      <div className="flex items-center justify-between mt-auto pt-3
                      border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* Avatar: shows "?" for anonymous, first letter of name otherwise */}
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center
                          justify-center text-purple-700 text-xs font-bold flex-shrink-0">
            {testimony.isAnonymous ? "?" : testimony.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{testimony.name}</p>
            <p className="text-xs text-gray-400">{testimony.location}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{testimony.date}</span>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────
// TESTIMONY MODAL COMPONENT
// The popup form for submitting a new testimony.
// Only reachable by registered users who have posted a prayer.
// ─────────────────────────────────────────
function TestimonyModal({ onClose, onSubmit }) {
  const { user } = useAuth();

  const [testimony, setTestimony]     = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted]     = useState(false); // Show success screen after submit

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testimony.trim()) return;

    // Build the testimony object
    // 🔧 TODO: Replace with POST /api/testimonies when backend is ready
    const newTestimony = {
      testimony,
      isAnonymous,
      name:     isAnonymous ? "Anonymous" : (user?.name || "Community Member"),
      location: user?.location || "Global",
      date:     new Date().toLocaleDateString("en-GB", {
                  month: "short",
                  year:  "numeric",
                }),
    };

    onSubmit(newTestimony);
    setSubmitted(true);
  };

  return (
    // Backdrop — clicking outside closes the modal
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Modal panel — stopPropagation prevents backdrop click from firing */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600
                     transition-colors p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Success screen — shown after form submission ── */}
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🙌</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Thank You!</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your testimony has been shared with the community.
              May it build the faith of many.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
                         px-8 py-2.5 rounded-full transition-colors duration-200"
            >
              Close
            </button>
          </div>

        ) : (

          // ── Form screen ──
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-purple-800">
                Share Your Testimony ✨
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Your story of answered prayer can build someone else's faith today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Testimony text area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Testimony
                </label>
                <textarea
                  required
                  rows={5}
                  value={testimony}
                  onChange={(e) => setTestimony(e.target.value)}
                  placeholder="Share how God answered your prayer..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             resize-none text-gray-700 leading-relaxed"
                />
                {/* Live character count */}
                <p className="text-xs text-gray-400 text-right mt-1">
                  {testimony.length} characters
                </p>
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-700 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="isAnonymous"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Share anonymously
                  </label>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Your name will be hidden. Your location may still be shown.
                  </p>
                </div>
              </div>

              {/* Live preview of how the testimony will appear */}
              <p className="text-xs text-gray-400 italic">
                Will appear as:{" "}
                <span className="text-purple-700 font-medium">
                  {isAnonymous ? "Anonymous" : (user?.name || "Community Member")}
                </span>
                {user?.location ? ` · ${user.location}` : ""}
              </p>

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white
                           font-semibold py-3 rounded-full transition-colors duration-200
                           shadow-md"
              >
                Share My Testimony 🙏
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TESTIMONY SHARE BUTTON COMPONENT
// Shows different states based on who is viewing:
//   1. Guest (not logged in)      → links to register
//   2. Logged in, no prayers yet  → locked with explanation
//   3. Logged in + has prayers    → opens modal
// ─────────────────────────────────────────
function TestimonyShareButton({ user, hasPrayers, onShare }) {
  // Controls the locked-state tooltip/message
  const [showMessage, setShowMessage] = useState(false);

  // ── State 1: Guest ──
  if (!user) {
    return (
      <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0">
        <Link
          to="/register"
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
                     px-6 py-3 rounded-full transition-colors duration-200
                     shadow-md text-sm whitespace-nowrap"
        >
          ✨ Share Your Testimony
        </Link>
        <p className="text-xs text-gray-400 italic">
          Create a free account to share yours
        </p>
      </div>
    );
  }

  // ── State 2: Logged in but no prayers posted yet ──
  if (!hasPrayers) {
    return (
      <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
        <button
          onClick={() => setShowMessage(!showMessage)}
          className="bg-purple-200 text-purple-400 font-semibold px-6 py-3
                     rounded-full text-sm whitespace-nowrap cursor-not-allowed"
        >
          ✨ Share Your Testimony 🔒
        </button>

        {/* Explanation popup — shown on click */}
        {showMessage && (
          <div className="bg-white border border-purple-200 rounded-2xl shadow-lg
                          p-4 max-w-xs">
            <p className="text-sm font-semibold text-purple-800 mb-1">
              One step away! 🙏
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              To share a testimony you must first submit at least one prayer
              request. This keeps our community authentic and trustworthy.
            </p>
            <Link
              to="/prayer-feed"
              className="inline-block mt-3 text-xs font-semibold text-purple-700
                         hover:text-purple-900 underline underline-offset-2"
            >
              Submit a prayer request →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // ── State 3: Fully unlocked ──
  return (
    <button
      onClick={onShare}
      className="flex-shrink-0 bg-purple-700 hover:bg-purple-800 text-white
                 font-semibold px-6 py-3 rounded-full transition-colors duration-200
                 shadow-md text-sm whitespace-nowrap"
    >
      ✨ Share Your Testimony
    </button>
  );
}

// ─────────────────────────────────────────
// HOME PAGE — Main component
// ─────────────────────────────────────────
function Home() {
  const { user, hasPrayers } = useAuth();

  // Modal open/close state
  const [showModal, setShowModal] = useState(false);

  // Testimony list — starts with mock data
  // New submissions are added to the top instantly (before backend is ready)
  const [testimonies, setTestimonies]   = useState(MOCK_TESTIMONIES);
  const [visibleCount, setVisibleCount] = useState(3); // Show 3 at a time

  // Called when user successfully submits testimony from the modal
  const handleNewTestimony = (newTestimony) => {
    setTestimonies((prev) => [{ ...newTestimony, id: Date.now() }, ...prev]);
    setVisibleCount((prev) => prev + 1); // Make sure the new one is visible
  };

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-purple-800 via-purple-700 to-purple-500
                          text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">

          <p className="uppercase text-purple-200 tracking-widest text-sm font-semibold mb-4">
            A Global Prayer Community
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Bring Your Prayers <br />
            <span className="text-purple-200">to the World</span>
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-10 leading-relaxed">
            The Intercessor unites believers across the globe. Share your prayer
            requests, intercede for others, and receive daily Scripture
            tailored to your needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link to="/register"
                  className="bg-white text-purple-800 font-bold px-8 py-3
                             rounded-full hover:bg-purple-100 transition text-lg shadow-md">
                  Join the Community
                </Link>
                <Link to="/login"
                  className="border-2 border-white text-white font-bold px-8 py-3
                             rounded-full hover:bg-white hover:text-purple-800 transition text-lg">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/prayer-feed"
                className="bg-white text-purple-800 font-bold px-8 py-3
                           rounded-full hover:bg-purple-100 transition text-lg shadow-md">
                Go to Prayer Feed →
              </Link>
            )}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BANNER
      ══════════════════════════════════════════ */}
      <section className="bg-purple-50 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: "10,000+", label: "Prayers Submitted" },
            { number: "150+",    label: "Countries Reached" },
            { number: "50,000+", label: "Prayers Answered" },
            { number: "365",     label: "Daily Scriptures" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-purple-800">{stat.number}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
              Everything You Need to Pray Together
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Built for believers who want to stay connected through prayer.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title}
                className="bg-purple-50 rounded-2xl p-6 hover:shadow-md
                           transition border border-purple-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIES SECTION
          Cards are visible to EVERYONE.
          Submitting is gated by registration + prayer history.
      ══════════════════════════════════════════ */}
      <section className="bg-purple-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Section header + share button side by side */}
          <div className="flex flex-col md:flex-row md:items-end justify-between
                          gap-6 mb-12">
            <div>
              <p className="uppercase text-purple-500 tracking-widest text-xs
                            font-semibold mb-2">
                Answered Prayers
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
                Testimonies from the Community
              </h2>
              <p className="text-gray-500 mt-2 text-base max-w-xl">
                Real stories of faith, hope, and God's faithfulness from believers
                across the world. Every testimony here was once a prayer request.
              </p>
            </div>

            {/* Smart button — behaviour depends on user's access level */}
            <TestimonyShareButton
              user={user}
              hasPrayers={hasPrayers}
              onShare={() => setShowModal(true)}
            />
          </div>

          {/* ── Testimony Cards ── visible to all visitors ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonies.slice(0, visibleCount).map((t) => (
              <TestimonyCard key={t.id} testimony={t} />
            ))}
          </div>

          {/* Load more button */}
          {visibleCount < testimonies.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="border-2 border-purple-700 text-purple-700 font-semibold
                           px-8 py-2.5 rounded-full hover:bg-purple-700 hover:text-white
                           transition-all duration-200"
              >
                Load More Testimonies
              </button>
            </div>
          )}

          {/* ── Guest invitation banner ──
              Only shown to visitors who are not logged in.
              Nudges them to join so they can eventually share their own testimony. */}
          {!user && (
            <div className="mt-14 bg-white border border-purple-200 rounded-2xl p-8
                            text-center shadow-sm">
              <p className="text-3xl mb-3">✨</p>
              <h3 className="text-xl font-bold text-purple-800 mb-2">
                Have a testimony to share?
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                Join PrayerConnect, submit your first prayer request, and when God
                answers — share it with the world. Your story could be the faith
                boost someone needs today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register"
                  className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
                             px-8 py-2.5 rounded-full transition-colors duration-200 text-sm">
                  Create Free Account
                </Link>
                <Link to="/login"
                  className="border-2 border-purple-200 text-purple-700 font-semibold
                             px-8 py-2.5 rounded-full hover:border-purple-500
                             transition-colors duration-200 text-sm">
                  Sign In
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-purple-800 text-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Prayer Community?
          </h2>
          <p className="text-purple-200 text-lg mb-8">
            Thousands of believers are already praying together. Your request matters.
          </p>
          {!user ? (
            <Link to="/register"
              className="bg-white text-purple-800 font-bold px-10 py-3
                         rounded-full hover:bg-purple-100 transition text-lg shadow-lg">
              Get Started — It's Free
            </Link>
          ) : (
            <Link to="/prayer-feed"
              className="bg-white text-purple-800 font-bold px-10 py-3
                         rounded-full hover:bg-purple-100 transition text-lg shadow-lg">
              View Prayer Feed →
            </Link>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-purple-900 text-purple-300 text-center py-6 text-sm">
        <p>© {new Date().getFullYear()} PrayerConnect. All rights reserved.</p>
        <p className="mt-1">Built with faith & love 🙏</p>
      </footer>

      {/* ══════════════════════════════════════════
          TESTIMONY MODAL
          Rendered here at root level so it overlays everything
      ══════════════════════════════════════════ */}
      {showModal && (
        <TestimonyModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewTestimony}
        />
      )}

    </div>
  );
}

export default Home;