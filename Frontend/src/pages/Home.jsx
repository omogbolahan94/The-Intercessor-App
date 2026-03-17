import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";     
import api from "../api/axios";                  

// ─────────────────────────────────────────
// FEATURES DATA
// ─────────────────────────────────────────
const FEATURES = [
  {
    icon: "✦",
    title: "Submit Prayer Requests",
    description:
      "Share your prayer needs with a caring global community. Your request reaches believers across the world.",
  },
  {
    icon: "◎",
    title: "Connect by Location",
    description:
      "Filter prayers by region and connect with believers who share your cultural and geographical background.",
  },
  {
    icon: "⟡",
    title: "Daily Scripture",
    description:
      "Receive personalised Bible scripture recommendations based on your prayer requests every single day.",
  },
  {
    icon: "✧",
    title: "Pray for Others",
    description:
      "Browse the prayer feed and intercede for fellow community members around the globe.",
  },
];

// ─────────────────────────────────────────
// MOCK TESTIMONIES
// 🔧 TODO: Replace with GET /api/testimonies
// ─────────────────────────────────────────
const MOCK_TESTIMONIES = [
  {
    id: 1,
    name: "Anonymous",
    location: "West Africa",
    date: "Feb 2025",
    testimony:
      "I prayed for my job situation for months. The community prayed with me and within two weeks I received a job offer beyond what I imagined. God is faithful.",
    isAnonymous: true,
  },
  {
    id: 2,
    name: "Grace M.",
    location: "United Kingdom",
    date: "Jan 2025",
    testimony:
      "My son was hospitalised and the doctors had no clear answers. I shared my request here and felt the power of collective prayer. He was discharged healthy three days later.",
    isAnonymous: false,
  },
  {
    id: 3,
    name: "Emmanuel O.",
    location: "East Africa",
    date: "Dec 2024",
    testimony:
      "We prayed for rain during a severe drought in our community. The rains came. Our church is testimony to the power of unified prayer across borders.",
    isAnonymous: false,
  },
  {
    id: 4,
    name: "Anonymous",
    location: "South Asia",
    date: "Jan 2025",
    testimony:
      "I was struggling with deep depression and felt completely alone. The prayers and scriptures I received through this platform gave me strength to seek help.",
    isAnonymous: true,
  },
  {
    id: 5,
    name: "Sarah K.",
    location: "North America",
    date: "Feb 2025",
    testimony:
      "After years of trying, we were blessed with a child. This community stood with us through every difficult moment. We are forever grateful.",
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
// TESTIMONY CARD
// ─────────────────────────────────────────
function TestimonyCard({ testimony }) {
  const [expanded, setExpanded] = useState(false);

  // Guard against missing data
  if (!testimony || !testimony.testimony) return null;

  // Map backend snake_case fields safely
  const text       = testimony.testimony;
  const isAnon     = testimony.is_anonymous ?? false;
  const authorName = isAnon
    ? "Anonymous"
    : (testimony.author_name || testimony.name || "Community Member");
  const location   = testimony.author_location || testimony.location || "Global";
  const date       = testimony.created_at
    ? new Date(testimony.created_at).toLocaleDateString("en-GB", {
        month: "short",
        year:  "numeric",
      })
    : (testimony.date || "");

  const isLong      = text.length > 160;
  const displayText = isLong && !expanded
    ? text.slice(0, 160) + "..."
    : text;

  const initial = isAnon ? "?" : (authorName?.[0]?.toUpperCase() ?? "?");

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-6
                    hover:border-[#7C3AED]/30 hover:shadow-sm
                    transition-all duration-200 flex flex-col gap-4">

      {/* Decorative opening quote */}
      <span style={{fontFamily: "'Cormorant Garamond', serif"}}
        className="text-4xl text-[#EDE9FE] leading-none select-none">
        "
      </span>

      {/* Testimony text */}
      <p className="text-sm text-[#52525B] leading-relaxed -mt-2">
        {displayText}
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
            className="ml-1.5 text-[#7C3AED] text-xs font-medium
                       hover:underline transition-colors">
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>

      {/* Author footer */}
      <div className="flex items-center justify-between mt-auto pt-4
                      border-t border-[#E4E4E7]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center
                          justify-center text-[#7C3AED] text-[11px] font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#18181B]">{authorName}</p>
            <p className="text-[11px] text-[#A1A1AA]">{location}</p>
          </div>
        </div>
        <span className="text-[11px] text-[#A1A1AA]">{date}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TESTIMONY MODAL
// ─────────────────────────────────────────
function TestimonyModal({ onClose, onSubmit }) {
  const { user }                      = useAuth();
  const [testimony, setTestimony]     = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testimony.trim()) return;
    onSubmit({
      testimony,
      isAnonymous,
      name:     isAnonymous ? "Anonymous" : (user?.name || "Community Member"),
      location: user?.location || "Global",
      date:     new Date().toLocaleDateString("en-GB", {
                  month: "short", year: "numeric",
                }),
    });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-5 text-[#A1A1AA]
                     hover:text-[#18181B] transition-colors"
          aria-label="Close">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success state */}
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-[#EDE9FE] flex items-center
                            justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#7C3AED]" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-2xl font-semibold text-[#18181B] mb-2">
              Thank You
            </h3>
            <p className="text-sm text-[#52525B] mb-6 leading-relaxed">
              Your testimony has been shared with the community.
              May it build the faith of many.
            </p>
            <button onClick={onClose}
              className="bg-[#18181B] hover:bg-[#27272A] text-white text-sm
                         font-medium px-8 py-2.5 rounded-lg transition-colors">
              Close
            </button>
          </div>

        ) : (
          <>
            <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-2xl font-semibold text-[#18181B] mb-1">
              Share Your Testimony
            </h3>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Your story of answered prayer can build someone else's faith today.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Testimony textarea */}
              <div>
                <label className="block text-xs font-medium text-[#52525B]
                                  uppercase tracking-wider mb-1.5">
                  Your Testimony
                </label>
                <textarea
                  required rows={5}
                  value={testimony}
                  onChange={(e) => setTestimony(e.target.value)}
                  placeholder="Share how God answered your prayer..."
                  className="w-full border border-[#E4E4E7] rounded-lg px-4
                             py-3 text-sm text-[#18181B] resize-none
                             leading-relaxed placeholder:text-[#A1A1AA]"
                />
                <p className="text-[11px] text-[#A1A1AA] text-right mt-1">
                  {testimony.length} characters
                </p>
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-start gap-3 p-4 bg-[#FAFAFA]
                              rounded-lg border border-[#E4E4E7]">
                <input
                  type="checkbox" id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-0.5 w-4 h-4 cursor-pointer"
                />
                <div>
                  <label htmlFor="anon"
                    className="text-sm font-medium text-[#18181B] cursor-pointer">
                    Share anonymously
                  </label>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Your name will be hidden. Location may still appear.
                  </p>
                </div>
              </div>

              {/* Live preview */}
              <p className="text-xs text-[#A1A1AA]">
                Will appear as:{" "}
                <span className="text-[#7C3AED] font-medium">
                  {isAnonymous ? "Anonymous" : (user?.name || "Community Member")}
                </span>
                {user?.location ? ` · ${user.location}` : ""}
              </p>

              {/* Submit — primary purple */}
              <button type="submit"
                className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                           text-sm font-semibold py-3 rounded-lg
                           transition-colors duration-200">
                Share Testimony
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TESTIMONY SHARE BUTTON
// ─────────────────────────────────────────
function TestimonyShareButton({ user, hasPrayers, onShare }) {
  const [showMessage, setShowMessage] = useState(false);

  // Guest
  if (!user) {
    return (
      <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0">
        <Link to="/register"
          className="text-sm font-semibold text-[#18181B] border border-[#18181B]
                     px-5 py-2.5 rounded-lg hover:bg-[#18181B] hover:text-white
                     transition-all duration-200 whitespace-nowrap">
          Share Your Testimony
        </Link>
        <p className="text-[11px] text-[#A1A1AA]">Account required</p>
      </div>
    );
  }

  // Logged in but no prayers
  if (!hasPrayers) {
    return (
      <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
        <button
          onClick={() => setShowMessage(!showMessage)}
          className="text-sm font-semibold text-[#A1A1AA] border border-[#E4E4E7]
                     px-5 py-2.5 rounded-lg cursor-not-allowed whitespace-nowrap">
          Share Your Testimony 🔒
        </button>
        {showMessage && (
          <div className="bg-white border border-[#E4E4E7] rounded-xl
                          shadow-lg p-4 max-w-xs">
            <p className="text-xs font-semibold text-[#18181B] mb-1">
              One step away
            </p>
            <p className="text-xs text-[#52525B] leading-relaxed">
              Submit at least one prayer request first to unlock testimonies.
            </p>
            <Link to="/prayer-feed"
              className="inline-block mt-2 text-xs font-medium text-[#7C3AED]
                         hover:underline">
              Submit a prayer →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Fully unlocked
  return (
    <button onClick={onShare}
      className="flex-shrink-0 text-sm font-semibold text-[#18181B]
                 border border-[#18181B] px-5 py-2.5 rounded-lg
                 hover:bg-[#18181B] hover:text-white
                 transition-all duration-200 whitespace-nowrap">
      Share Your Testimony
    </button>
  );
}

// ─────────────────────────────────────────
// HOME PAGE — Main component
// ─────────────────────────────────────────
function Home() {
  const { user, hasPrayers }                    = useAuth();
  const [showModal, setShowModal]               = useState(false);
  const [testimonies, setTestimonies]           = useState([]);
  const [visibleCount, setVisibleCount]         = useState(3);
  const [testimonyLoading, setTestimonyLoading] = useState(true);

  // Fetch testimonies from backend on mount
  useEffect(() => {
    api.get("/testimonies")
      .then((res) => {
        // Ensure we always set an array, never undefined
        const data = Array.isArray(res.data) ? res.data : [];
        setTestimonies(data);
      })
      .catch((err) => {
        console.error("Failed to fetch testimonies", err);
        setTestimonies([]); // fail silently — don't crash the page
      })
      .finally(() => setTestimonyLoading(false));
  }, []);

  const handleNewTestimony = async (newTestimony) => {
    try {
      const res = await api.post("/testimonies", {
        testimony:    newTestimony.testimony,
        is_anonymous: newTestimony.isAnonymous,
      });
      setTestimonies((prev) => [res.data, ...prev]);
      setVisibleCount((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to submit testimony", err);
    }
  };

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-px h-4 bg-[#7C3AED]" />
              <span className="text-xs font-medium text-[#7C3AED] uppercase
                               tracking-widest">
                A Global Prayer Community
              </span>
            </div>

            <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-5xl md:text-6xl font-semibold text-[#18181B]
                         leading-[1.05] tracking-tight mb-6">
              Where Faith Meets
              <br />
              <span className="text-[#7C3AED]">Intercession</span>
            </h1>

            <p className="text-base text-[#52525B] leading-relaxed mb-10 max-w-md">
              Submit your prayer requests, stand with others in intercession,
              and receive daily scripture personalised to your needs.
              Believers across the world are praying together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              {!user ? (
                <>
                  <Link to="/register"
                    className="inline-flex items-center justify-center
                               bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                               text-sm font-semibold px-8 py-3 rounded-lg
                               transition-colors duration-200 shadow-sm">
                    Join the Community
                  </Link>
                  <Link to="/login"
                    className="inline-flex items-center justify-center
                               bg-[#18181B] hover:bg-[#27272A] text-white
                               text-sm font-semibold px-8 py-3 rounded-lg
                               transition-colors duration-200">
                    Sign In
                  </Link>
                </>
              ) : (
                <Link to="/prayer-feed"
                  className="inline-flex items-center justify-center
                             bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                             text-sm font-semibold px-8 py-3 rounded-lg
                             transition-colors duration-200 shadow-sm">
                  Go to Prayer Feed →
                </Link>
              )}
            </div>

            <p className="text-xs text-[#A1A1AA] mt-5">
              Joined by believers from{" "}
              <span className="text-[#18181B] font-medium">150+ countries</span>
              {" "}· Free forever
            </p>
          </div>

          {/* Right: Image */}
          <div className="relative hidden md:block">
            <div className="absolute -top-6 -right-6 w-full h-full
                            bg-[#EDE9FE] rounded-2xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-xl
                            aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"
                alt="Believers praying together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t
                              from-black/30 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5
                              bg-white/95 backdrop-blur-sm rounded-xl p-4
                              shadow-lg">
                <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-sm font-medium text-[#18181B] italic
                             leading-snug mb-1">
                  "The prayer of a righteous person is powerful and effective."
                </p>
                <p className="text-[11px] text-[#7C3AED] font-medium uppercase
                              tracking-wider">
                  — James 5:16
                </p>
              </div>
            </div>
            <div className="absolute -left-5 top-10 bg-white rounded-xl
                            shadow-lg px-4 py-3 border border-[#E4E4E7]">
              <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-2xl font-semibold text-[#7C3AED]">
                10k+
              </p>
              <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                Prayers submitted
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="border-y border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { number: "10,000+", label: "Prayers Submitted", sub: "and growing daily",      accent: true  },
              { number: "150+",    label: "Countries Reached", sub: "nations represented",    accent: false },
              { number: "50,000+", label: "Prayers Answered",  sub: "testimonies shared",     accent: false },
              { number: "365",     label: "Daily Scriptures",  sub: "personalised to you",    accent: false },
            ].map((stat, i) => (
              <div key={stat.label}
                className={`py-10 px-8 flex flex-col gap-3
                  ${i < 3 ? "border-r border-[#E4E4E7]" : ""}
                  ${i >= 2 ? "border-t border-[#E4E4E7] md:border-t-0" : ""}
                  group hover:bg-[#FAFAFA] transition-colors duration-200`}>
                <div className={`w-8 h-[2px] mb-1
                  ${stat.accent ? "bg-[#7C3AED]" : "bg-[#E4E4E7]"}
                  group-hover:bg-[#7C3AED] transition-colors duration-300`} />
                <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-4xl md:text-5xl font-semibold text-[#18181B]
                             leading-none tracking-tight">
                  {stat.number}
                </p>
                <div>
                  <p className="text-xs font-semibold text-[#18181B] uppercase
                                tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-[#E4E4E7]">
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-px h-4 bg-[#7C3AED]" />
            <span className="text-xs font-medium text-[#7C3AED] uppercase
                             tracking-widest">
              What We Offer
            </span>
          </div>
          <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-4xl md:text-5xl font-semibold text-[#18181B]">
            Everything You Need<br />to Pray Together
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E4E4E7]
                        border border-[#E4E4E7] rounded-xl overflow-hidden">
          {FEATURES.map((feature) => (
            <div key={feature.title}
              className="bg-white p-8 hover:bg-[#FAFAFA]
                         transition-colors duration-200">
              <span className="text-2xl text-[#7C3AED] block mb-4">
                {feature.icon}
              </span>
              <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-xl font-semibold text-[#18181B] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIES
      ══════════════════════════════════════════ */}
      <section className="border-t border-[#E4E4E7] bg-[#FAFAFA] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end
                          justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-px h-4 bg-[#7C3AED]" />
                <span className="text-xs font-medium text-[#7C3AED] uppercase
                                 tracking-widest">
                  Answered Prayers
                </span>
              </div>
              <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-4xl md:text-5xl font-semibold text-[#18181B]">
                Community Testimonies
              </h2>
              <p className="text-sm text-[#52525B] mt-2 max-w-lg leading-relaxed">
                Real stories of faith and God's faithfulness from believers
                across the world.
              </p>
            </div>
            <TestimonyShareButton
              user={user}
              hasPrayers={hasPrayers}
              onShare={() => setShowModal(true)}
            />
          </div>

          {/* Loading skeleton */}
          {testimonyLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white border border-[#E4E4E7]
                                        rounded-xl p-6 animate-pulse h-48" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2
                              lg:grid-cols-3 gap-4">
                {testimonies
                .filter((t) => t && t.testimony)
                .slice(0, visibleCount)
                .map((t) => (
                  <TestimonyCard key={t.id} testimony={t} />
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mt-10">
                {visibleCount < testimonies.length && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    className="text-sm font-medium text-[#52525B]
                              border border-[#E4E4E7] px-6 py-2.5 rounded-lg
                              hover:border-[#18181B] hover:text-[#18181B]
                              transition-all duration-200">
                    Load More
                  </button>
                )}
                <Link to="/testimonies"
                  className="text-sm font-semibold text-[#7C3AED] border
                            border-[#7C3AED] px-6 py-2.5 rounded-lg
                            hover:bg-[#7C3AED] hover:text-white
                            transition-all duration-200">
                  View All Testimonies →
                </Link>
              </div>
            </>
          )}

          {!user && (
            <div className="mt-14 bg-white border border-[#E4E4E7] rounded-xl
                            p-8 md:p-12 text-center">
              <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-2xl font-semibold text-[#18181B] mb-2">
                Have a testimony to share?
              </h3>
              <p className="text-sm text-[#52525B] max-w-md mx-auto
                            leading-relaxed mb-6">
                Join the community, submit your first prayer request, and
                when God answers — share it with the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register"
                  className="text-sm font-semibold text-white bg-[#7C3AED]
                             hover:bg-[#5B21B6] px-8 py-2.5 rounded-lg
                             transition-colors duration-200">
                  Create Free Account
                </Link>
                <Link to="/login"
                  className="text-sm font-semibold text-[#52525B]
                             border border-[#E4E4E7] px-8 py-2.5 rounded-lg
                             hover:border-[#18181B] hover:text-[#18181B]
                             transition-colors duration-200">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════ */}
      <section className="border-t border-[#E4E4E7] py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-4xl md:text-5xl font-semibold text-[#18181B] mb-4">
            Ready to Pray Together?
          </h2>
          <p className="text-sm text-[#52525B] leading-relaxed mb-8">
            Thousands of believers are already praying together.
            Your request matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user ? (
              <>
                <Link to="/register"
                  className="inline-flex items-center justify-center
                             bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                             text-sm font-semibold px-10 py-3 rounded-lg
                             transition-colors duration-200 shadow-sm">
                  Get Started — It's Free
                </Link>
                <Link to="/about"
                  className="inline-flex items-center justify-center
                             border border-[#E4E4E7] text-[#52525B]
                             hover:border-[#18181B] hover:text-[#18181B]
                             text-sm font-semibold px-10 py-3 rounded-lg
                             transition-colors duration-200">
                  Learn More
                </Link>
              </>
            ) : (
              <Link to="/prayer-feed"
                className="inline-flex items-center justify-center
                           bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                           text-sm font-semibold px-10 py-3 rounded-lg
                           transition-colors duration-200 shadow-sm">
                View Prayer Feed →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-[#E4E4E7] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 28 28" fill="none"
              className="w-5 h-5 text-[#7C3AED]">
              <rect x="12" y="2" width="4" height="24" rx="1.5"
                fill="currentColor"/>
              <rect x="4" y="9" width="20" height="4" rx="1.5"
                fill="currentColor"/>
            </svg>
            <span style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-sm font-medium text-[#18181B]">
              The Intercessors
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA]">
            © {new Date().getFullYear()} The Intercessors. Built with faith & love.
          </p>
        </div>
      </footer>

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