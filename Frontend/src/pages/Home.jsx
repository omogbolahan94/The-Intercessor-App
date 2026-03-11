import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

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
  const isLong      = testimony.testimony.length > 160;
  const displayText = isLong && !expanded
    ? testimony.testimony.slice(0, 160) + "..."
    : testimony.testimony;

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
            {testimony.isAnonymous ? "?" : testimony.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#18181B]">{testimony.name}</p>
            <p className="text-[11px] text-[#A1A1AA]">{testimony.location}</p>
          </div>
        </div>
        <span className="text-[11px] text-[#A1A1AA]">{testimony.date}</span>
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
  const { user, hasPrayers }            = useAuth();
  const [showModal, setShowModal]       = useState(false);
  const [testimonies, setTestimonies]   = useState(MOCK_TESTIMONIES);
  const [visibleCount, setVisibleCount] = useState(3);

  const handleNewTestimony = (newTestimony) => {
    setTestimonies((prev) => [{ ...newTestimony, id: Date.now() }, ...prev]);
    setVisibleCount((prev) => prev + 1);
  };

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════
          HERO — Two column with image on right
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text ── */}
          <div>
            {/* Eyebrow label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-px h-4 bg-[#7C3AED]" />
              <span className="text-xs font-medium text-[#7C3AED] uppercase
                               tracking-widest">
                A Global Prayer Community
              </span>
            </div>

            {/* Headline */}
            <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-5xl md:text-6xl font-semibold text-[#18181B]
                         leading-[1.05] tracking-tight mb-6">
              Where Faith Meets
              <br />
              <span className="text-[#7C3AED]">Intercession</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base text-[#52525B] leading-relaxed mb-10 max-w-md">
              Submit your prayer requests, stand with others in intercession,
              and receive daily scripture personalised to your needs.
              Believers across the world are praying together.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!user ? (
                <>
                  {/* Primary — purple */}
                  <Link to="/register"
                    className="inline-flex items-center justify-center
                               bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                               text-sm font-semibold px-8 py-3 rounded-lg
                               transition-colors duration-200 shadow-sm">
                    Join the Community
                  </Link>
                  {/* Secondary — dark charcoal */}
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

            {/* Social proof */}
            <p className="text-xs text-[#A1A1AA] mt-5">
              Joined by believers from{" "}
              <span className="text-[#18181B] font-medium">150+ countries</span>
              {" "}· Free forever
            </p>
          </div>

          {/* ── Right: Image ── */}
          <div className="relative hidden md:block">

            {/* Decorative shape behind image */}
            <div className="absolute -top-6 -right-6 w-full h-full
                            bg-[#EDE9FE] rounded-2xl" />

            {/* Image container */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl
                            aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80"
                alt="Believers praying together"
                className="w-full h-full object-cover"
              />
              {/* Subtle dark gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t
                              from-black/30 via-transparent to-transparent" />

              {/* Floating scripture card over image */}
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

            {/* Floating stat badge — outside top left of image */}
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
          STATS — Asymmetric editorial cards
      ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
    STATS — Clean editorial row
══════════════════════════════════════════ */}
      <section className="border-y border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">

            {[
              {
                number:  "10,000+",
                label:   "Prayers Submitted",
                sub:     "and growing daily",
                accent:  true,   // purple top bar
              },
              {
                number:  "150+",
                label:   "Countries Reached",
                sub:     "nations represented",
                accent:  false,
              },
              {
                number:  "50,000+",
                label:   "Prayers Answered",
                sub:     "testimonies shared",
                accent:  false,
              },
              {
                number:  "365",
                label:   "Daily Scriptures",
                sub:     "personalised to you",
                accent:  false,
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`
                  py-10 px-8 flex flex-col gap-3
                  ${i < 3 ? "border-r border-[#E4E4E7]" : ""}
                  ${i >= 2 ? "border-t border-[#E4E4E7] md:border-t-0" : ""}
                  group hover:bg-[#FAFAFA] transition-colors duration-200
                `}
              >
                {/* Thin top accent — purple only on first stat */}
                <div className={`w-8 h-[2px] mb-1
                  ${stat.accent ? "bg-[#7C3AED]" : "bg-[#E4E4E7]"}
                  group-hover:bg-[#7C3AED] transition-colors duration-300`}
                />

                {/* Number */}
                <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-4xl md:text-5xl font-semibold text-[#18181B]
                            leading-none tracking-tight">
                  {stat.number}
                </p>

                {/* Label */}
                <div>
                  <p className="text-xs font-semibold text-[#18181B] uppercase
                                tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    {stat.sub}
                  </p>
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

        {/* Bordered grid */}
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

          {/* Section header */}
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

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonies.slice(0, visibleCount).map((t) => (
              <TestimonyCard key={t.id} testimony={t} />
            ))}
          </div>

          {/* Load more — ghost style */}
          {visibleCount < testimonies.length && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="text-sm font-medium text-[#52525B]
                           border border-[#E4E4E7] px-8 py-2.5 rounded-lg
                           hover:border-[#18181B] hover:text-[#18181B]
                           transition-all duration-200">
                Load More Testimonies
              </button>
            </div>
          )}

          {/* Guest invite banner */}
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
                {/* Primary */}
                <Link to="/register"
                  className="text-sm font-semibold text-white bg-[#7C3AED]
                             hover:bg-[#5B21B6] px-8 py-2.5 rounded-lg
                             transition-colors duration-200">
                  Create Free Account
                </Link>
                {/* Secondary — dark */}
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
                {/* Primary — purple */}
                <Link to="/register"
                  className="inline-flex items-center justify-center
                             bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                             text-sm font-semibold px-10 py-3 rounded-lg
                             transition-colors duration-200 shadow-sm">
                  Get Started — It's Free
                </Link>
                {/* Ghost — learn more */}
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

      {/* Testimony Modal */}
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

// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";

// // ─────────────────────────────────────────
// // FEATURES DATA
// // ─────────────────────────────────────────
// const FEATURES = [
//   {
//     icon: "🙏",
//     title: "Submit Prayer Requests",
//     description:
//       "Share your prayer needs with a caring global community. Your request reaches believers across the world.",
//   },
//   {
//     icon: "🌍",
//     title: "Connect by Location",
//     description:
//       "Filter prayers by region and connect with believers who share your cultural and geographical background.",
//   },
//   {
//     icon: "📖",
//     title: "Daily Scripture",
//     description:
//       "Receive personalised Bible scripture recommendations based on your prayer requests every single day.",
//   },
//   {
//     icon: "🤝",
//     title: "Pray for Others",
//     description:
//       "Browse the prayer feed and intercede for fellow community members around the globe.",
//   },
// ];

// // ─────────────────────────────────────────
// // MOCK TESTIMONIES
// // These simulate real data from your database.
// // 🔧 TODO: Replace with GET /api/testimonies when backend is ready
// // ─────────────────────────────────────────
// const MOCK_TESTIMONIES = [
//   {
//     id: 1,
//     name: "Anonymous",
//     location: "West Africa",
//     date: "Feb 2025",
//     testimony:
//       "I prayed for my job situation for months. The community prayed with me and within two weeks I received a job offer beyond what I imagined. God is faithful!",
//     isAnonymous: true,
//   },
//   {
//     id: 2,
//     name: "Grace M.",
//     location: "United Kingdom",
//     date: "Jan 2025",
//     testimony:
//       "My son was hospitalised and the doctors had no clear answers. I shared my request here and felt the power of collective prayer. He was discharged healthy three days later. Thank you all.",
//     isAnonymous: false,
//   },
//   {
//     id: 3,
//     name: "Anonymous",
//     location: "South Asia",
//     date: "Jan 2025",
//     testimony:
//       "I was struggling with deep depression and felt completely alone. The prayers and scriptures I received through this platform gave me the strength to seek help. I am doing so much better now.",
//     isAnonymous: true,
//   },
//   {
//     id: 4,
//     name: "Emmanuel O.",
//     location: "East Africa",
//     date: "Dec 2024",
//     testimony:
//       "We prayed for rain during a severe drought in our community. The rains came. Our church is testimony to the power of unified prayer across borders.",
//     isAnonymous: false,
//   },
//   {
//     id: 5,
//     name: "Sarah K.",
//     location: "North America",
//     date: "Feb 2025",
//     testimony:
//       "After years of trying, we were blessed with a child. This community stood with us in prayer through every difficult moment. We are forever grateful.",
//     isAnonymous: false,
//   },
//   {
//     id: 6,
//     name: "Anonymous",
//     location: "Europe",
//     date: "Dec 2024",
//     testimony:
//       "My marriage was on the verge of collapse. I prayed quietly here without telling anyone. Slowly things changed. We are still together and healing.",
//     isAnonymous: true,
//   },
// ];

// // ─────────────────────────────────────────
// // TESTIMONY CARD COMPONENT
// // Renders a single testimony — visible to everyone
// // ─────────────────────────────────────────
// function TestimonyCard({ testimony }) {
//   // Controls whether a long testimony is fully shown or truncated
//   const [expanded, setExpanded] = useState(false);

//   const isLong      = testimony.testimony.length > 180;
//   const displayText = isLong && !expanded
//     ? testimony.testimony.slice(0, 180) + "..."
//     : testimony.testimony;

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100
//                     hover:shadow-md hover:border-purple-200 transition-all duration-200
//                     flex flex-col gap-4">

//       {/* Decorative opening quote mark */}
//       <span className="text-5xl text-purple-200 font-serif leading-none">"</span>

//       {/* Testimony text */}
//       <p className="text-gray-600 text-sm leading-relaxed -mt-3">
//         {displayText}
//         {/* Read more / less toggle — only for long testimonies */}
//         {isLong && (
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="ml-2 text-purple-600 hover:text-purple-800 text-xs
//                        font-semibold transition-colors"
//           >
//             {expanded ? "Show less" : "Read more"}
//           </button>
//         )}
//       </p>

//       {/* Card footer — author info */}
//       <div className="flex items-center justify-between mt-auto pt-3
//                       border-t border-gray-100">
//         <div className="flex items-center gap-2">
//           {/* Avatar: shows "?" for anonymous, first letter of name otherwise */}
//           <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center
//                           justify-center text-purple-700 text-xs font-bold flex-shrink-0">
//             {testimony.isAnonymous ? "?" : testimony.name[0].toUpperCase()}
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-gray-700">{testimony.name}</p>
//             <p className="text-xs text-gray-400">{testimony.location}</p>
//           </div>
//         </div>
//         <span className="text-xs text-gray-400">{testimony.date}</span>
//       </div>

//     </div>
//   );
// }

// // ─────────────────────────────────────────
// // TESTIMONY MODAL COMPONENT
// // The popup form for submitting a new testimony.
// // Only reachable by registered users who have posted a prayer.
// // ─────────────────────────────────────────
// function TestimonyModal({ onClose, onSubmit }) {
//   const { user } = useAuth();

//   const [testimony, setTestimony]     = useState("");
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [submitted, setSubmitted]     = useState(false); // Show success screen after submit

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!testimony.trim()) return;

//     // Build the testimony object
//     // 🔧 TODO: Replace with POST /api/testimonies when backend is ready
//     const newTestimony = {
//       testimony,
//       isAnonymous,
//       name:     isAnonymous ? "Anonymous" : (user?.name || "Community Member"),
//       location: user?.location || "Global",
//       date:     new Date().toLocaleDateString("en-GB", {
//                   month: "short",
//                   year:  "numeric",
//                 }),
//     };

//     onSubmit(newTestimony);
//     setSubmitted(true);
//   };

//   return (
//     // Backdrop — clicking outside closes the modal
//     <div
//       className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
//                  flex items-center justify-center px-4"
//       onClick={onClose}
//     >
//       {/* Modal panel — stopPropagation prevents backdrop click from firing */}
//       <div
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
//         onClick={(e) => e.stopPropagation()}
//       >

//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600
//                      transition-colors p-1"
//           aria-label="Close"
//         >
//           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* ── Success screen — shown after form submission ── */}
//         {submitted ? (
//           <div className="text-center py-8">
//             <div className="text-5xl mb-4">🙌</div>
//             <h3 className="text-2xl font-bold text-purple-800 mb-2">Thank You!</h3>
//             <p className="text-gray-500 mb-6 leading-relaxed">
//               Your testimony has been shared with the community.
//               May it build the faith of many.
//             </p>
//             <button
//               onClick={onClose}
//               className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
//                          px-8 py-2.5 rounded-full transition-colors duration-200"
//             >
//               Close
//             </button>
//           </div>

//         ) : (

//           // ── Form screen ──
//           <>
//             <div className="mb-6">
//               <h3 className="text-2xl font-bold text-purple-800">
//                 Share Your Testimony ✨
//               </h3>
//               <p className="text-gray-500 text-sm mt-1">
//                 Your story of answered prayer can build someone else's faith today.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">

//               {/* Testimony text area */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Your Testimony
//                 </label>
//                 <textarea
//                   required
//                   rows={5}
//                   value={testimony}
//                   onChange={(e) => setTestimony(e.target.value)}
//                   placeholder="Share how God answered your prayer..."
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                              focus:outline-none focus:ring-2 focus:ring-purple-500
//                              resize-none text-gray-700 leading-relaxed"
//                 />
//                 {/* Live character count */}
//                 <p className="text-xs text-gray-400 text-right mt-1">
//                   {testimony.length} characters
//                 </p>
//               </div>

//               {/* Anonymous toggle */}
//               <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
//                 <input
//                   type="checkbox"
//                   id="isAnonymous"
//                   checked={isAnonymous}
//                   onChange={(e) => setIsAnonymous(e.target.checked)}
//                   className="mt-0.5 w-4 h-4 accent-purple-700 cursor-pointer"
//                 />
//                 <div>
//                   <label
//                     htmlFor="isAnonymous"
//                     className="text-sm font-medium text-gray-700 cursor-pointer"
//                   >
//                     Share anonymously
//                   </label>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     Your name will be hidden. Your location may still be shown.
//                   </p>
//                 </div>
//               </div>

//               {/* Live preview of how the testimony will appear */}
//               <p className="text-xs text-gray-400 italic">
//                 Will appear as:{" "}
//                 <span className="text-purple-700 font-medium">
//                   {isAnonymous ? "Anonymous" : (user?.name || "Community Member")}
//                 </span>
//                 {user?.location ? ` · ${user.location}` : ""}
//               </p>

//               <button
//                 type="submit"
//                 className="w-full bg-purple-700 hover:bg-purple-800 text-white
//                            font-semibold py-3 rounded-full transition-colors duration-200
//                            shadow-md"
//               >
//                 Share My Testimony 🙏
//               </button>

//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────
// // TESTIMONY SHARE BUTTON COMPONENT
// // Shows different states based on who is viewing:
// //   1. Guest (not logged in)      → links to register
// //   2. Logged in, no prayers yet  → locked with explanation
// //   3. Logged in + has prayers    → opens modal
// // ─────────────────────────────────────────
// function TestimonyShareButton({ user, hasPrayers, onShare }) {
//   // Controls the locked-state tooltip/message
//   const [showMessage, setShowMessage] = useState(false);

//   // ── State 1: Guest ──
//   if (!user) {
//     return (
//       <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0">
//         <Link
//           to="/register"
//           className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
//                      px-6 py-3 rounded-full transition-colors duration-200
//                      shadow-md text-sm whitespace-nowrap"
//         >
//           ✨ Share Your Testimony
//         </Link>
//         <p className="text-xs text-gray-400 italic">
//           Create a free account to share yours
//         </p>
//       </div>
//     );
//   }

//   // ── State 2: Logged in but no prayers posted yet ──
//   if (!hasPrayers) {
//     return (
//       <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
//         <button
//           onClick={() => setShowMessage(!showMessage)}
//           className="bg-purple-200 text-purple-400 font-semibold px-6 py-3
//                      rounded-full text-sm whitespace-nowrap cursor-not-allowed"
//         >
//           ✨ Share Your Testimony 🔒
//         </button>

//         {/* Explanation popup — shown on click */}
//         {showMessage && (
//           <div className="bg-white border border-purple-200 rounded-2xl shadow-lg
//                           p-4 max-w-xs">
//             <p className="text-sm font-semibold text-purple-800 mb-1">
//               One step away! 🙏
//             </p>
//             <p className="text-xs text-gray-500 leading-relaxed">
//               To share a testimony you must first submit at least one prayer
//               request. This keeps our community authentic and trustworthy.
//             </p>
//             <Link
//               to="/prayer-feed"
//               className="inline-block mt-3 text-xs font-semibold text-purple-700
//                          hover:text-purple-900 underline underline-offset-2"
//             >
//               Submit a prayer request →
//             </Link>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ── State 3: Fully unlocked ──
//   return (
//     <button
//       onClick={onShare}
//       className="flex-shrink-0 bg-purple-700 hover:bg-purple-800 text-white
//                  font-semibold px-6 py-3 rounded-full transition-colors duration-200
//                  shadow-md text-sm whitespace-nowrap"
//     >
//       ✨ Share Your Testimony
//     </button>
//   );
// }

// // ─────────────────────────────────────────
// // HOME PAGE — Main component
// // ─────────────────────────────────────────
// function Home() {
//   const { user, hasPrayers } = useAuth();

//   // Modal open/close state
//   const [showModal, setShowModal] = useState(false);

//   // Testimony list — starts with mock data
//   // New submissions are added to the top instantly (before backend is ready)
//   const [testimonies, setTestimonies]   = useState(MOCK_TESTIMONIES);
//   const [visibleCount, setVisibleCount] = useState(3); // Show 3 at a time

//   // Called when user successfully submits testimony from the modal
//   const handleNewTestimony = (newTestimony) => {
//     setTestimonies((prev) => [{ ...newTestimony, id: Date.now() }, ...prev]);
//     setVisibleCount((prev) => prev + 1); // Make sure the new one is visible
//   };

//   return (
//     <div className="bg-white">

//       {/* ══════════════════════════════════════════
//           HERO SECTION
//       ══════════════════════════════════════════ */}
//       <section className="bg-gradient-to-br from-purple-800 via-purple-700 to-purple-500
//                           text-white py-24 px-4 text-center">
//         <div className="max-w-3xl mx-auto">

//           <p className="uppercase text-purple-200 tracking-widest text-sm font-semibold mb-4">
//             A Global Prayer Community
//           </p>
//           <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
//             Bring Your Prayers <br />
//             <span className="text-purple-200">to the World</span>
//           </h1>
//           <p className="text-lg md:text-xl text-purple-100 mb-10 leading-relaxed">
//             The Intercessor unites believers across the globe. Share your prayer
//             requests, intercede for others, and receive daily Scripture
//             tailored to your needs.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             {!user ? (
//               <>
//                 <Link to="/register"
//                   className="bg-white text-purple-800 font-bold px-8 py-3
//                              rounded-full hover:bg-purple-100 transition text-lg shadow-md">
//                   Join the Community
//                 </Link>
//                 <Link to="/login"
//                   className="border-2 border-white text-white font-bold px-8 py-3
//                              rounded-full hover:bg-white hover:text-purple-800 transition text-lg">
//                   Sign In
//                 </Link>
//               </>
//             ) : (
//               <Link to="/prayer-feed"
//                 className="bg-white text-purple-800 font-bold px-8 py-3
//                            rounded-full hover:bg-purple-100 transition text-lg shadow-md">
//                 Go to Prayer Feed →
//               </Link>
//             )}
//           </div>

//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           STATS BANNER
//       ══════════════════════════════════════════ */}
//       <section className="bg-purple-50 py-10 px-4">
//         <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//           {[
//             { number: "10,000+", label: "Prayers Submitted" },
//             { number: "150+",    label: "Countries Reached" },
//             { number: "50,000+", label: "Prayers Answered" },
//             { number: "365",     label: "Daily Scriptures" },
//           ].map((stat) => (
//             <div key={stat.label}>
//               <p className="text-3xl font-extrabold text-purple-800">{stat.number}</p>
//               <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           FEATURES SECTION
//       ══════════════════════════════════════════ */}
//       <section className="py-20 px-4">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-14">
//             <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
//               Everything You Need to Pray Together
//             </h2>
//             <p className="text-gray-500 mt-3 text-lg">
//               Built for believers who want to stay connected through prayer.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//             {FEATURES.map((feature) => (
//               <div key={feature.title}
//                 className="bg-purple-50 rounded-2xl p-6 hover:shadow-md
//                            transition border border-purple-100">
//                 <div className="text-4xl mb-4">{feature.icon}</div>
//                 <h3 className="text-xl font-bold text-purple-800 mb-2">{feature.title}</h3>
//                 <p className="text-gray-600 leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           TESTIMONIES SECTION
//           Cards are visible to EVERYONE.
//           Submitting is gated by registration + prayer history.
//       ══════════════════════════════════════════ */}
//       <section className="bg-purple-50 py-20 px-4">
//         <div className="max-w-5xl mx-auto">

//           {/* Section header + share button side by side */}
//           <div className="flex flex-col md:flex-row md:items-end justify-between
//                           gap-6 mb-12">
//             <div>
//               <p className="uppercase text-purple-500 tracking-widest text-xs
//                             font-semibold mb-2">
//                 Answered Prayers
//               </p>
//               <h2 className="text-3xl md:text-4xl font-bold text-purple-800">
//                 Testimonies from the Community
//               </h2>
//               <p className="text-gray-500 mt-2 text-base max-w-xl">
//                 Real stories of faith, hope, and God's faithfulness from believers
//                 across the world. Every testimony here was once a prayer request.
//               </p>
//             </div>

//             {/* Smart button — behaviour depends on user's access level */}
//             <TestimonyShareButton
//               user={user}
//               hasPrayers={hasPrayers}
//               onShare={() => setShowModal(true)}
//             />
//           </div>

//           {/* ── Testimony Cards ── visible to all visitors ── */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {testimonies.slice(0, visibleCount).map((t) => (
//               <TestimonyCard key={t.id} testimony={t} />
//             ))}
//           </div>

//           {/* Load more button */}
//           {visibleCount < testimonies.length && (
//             <div className="text-center mt-10">
//               <button
//                 onClick={() => setVisibleCount((prev) => prev + 3)}
//                 className="border-2 border-purple-700 text-purple-700 font-semibold
//                            px-8 py-2.5 rounded-full hover:bg-purple-700 hover:text-white
//                            transition-all duration-200"
//               >
//                 Load More Testimonies
//               </button>
//             </div>
//           )}

//           {/* ── Guest invitation banner ──
//               Only shown to visitors who are not logged in.
//               Nudges them to join so they can eventually share their own testimony. */}
//           {!user && (
//             <div className="mt-14 bg-white border border-purple-200 rounded-2xl p-8
//                             text-center shadow-sm">
//               <p className="text-3xl mb-3">✨</p>
//               <h3 className="text-xl font-bold text-purple-800 mb-2">
//                 Have a testimony to share?
//               </h3>
//               <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
//                 Join PrayerConnect, submit your first prayer request, and when God
//                 answers — share it with the world. Your story could be the faith
//                 boost someone needs today.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <Link to="/register"
//                   className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
//                              px-8 py-2.5 rounded-full transition-colors duration-200 text-sm">
//                   Create Free Account
//                 </Link>
//                 <Link to="/login"
//                   className="border-2 border-purple-200 text-purple-700 font-semibold
//                              px-8 py-2.5 rounded-full hover:border-purple-500
//                              transition-colors duration-200 text-sm">
//                   Sign In
//                 </Link>
//               </div>
//             </div>
//           )}

//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           BOTTOM CTA SECTION
//       ══════════════════════════════════════════ */}
//       <section className="bg-purple-800 text-white py-20 px-4 text-center">
//         <div className="max-w-2xl mx-auto">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Ready to Join the Prayer Community?
//           </h2>
//           <p className="text-purple-200 text-lg mb-8">
//             Thousands of believers are already praying together. Your request matters.
//           </p>
//           {!user ? (
//             <Link to="/register"
//               className="bg-white text-purple-800 font-bold px-10 py-3
//                          rounded-full hover:bg-purple-100 transition text-lg shadow-lg">
//               Get Started — It's Free
//             </Link>
//           ) : (
//             <Link to="/prayer-feed"
//               className="bg-white text-purple-800 font-bold px-10 py-3
//                          rounded-full hover:bg-purple-100 transition text-lg shadow-lg">
//               View Prayer Feed →
//             </Link>
//           )}
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════════ */}
//       <footer className="bg-purple-900 text-purple-300 text-center py-6 text-sm">
//         <p>© {new Date().getFullYear()} PrayerConnect. All rights reserved.</p>
//         <p className="mt-1">Built with faith & love 🙏</p>
//       </footer>

//       {/* ══════════════════════════════════════════
//           TESTIMONY MODAL
//           Rendered here at root level so it overlays everything
//       ══════════════════════════════════════════ */}
//       {showModal && (
//         <TestimonyModal
//           onClose={() => setShowModal(false)}
//           onSubmit={handleNewTestimony}
//         />
//       )}

//     </div>
//   );
// }

// export default Home;