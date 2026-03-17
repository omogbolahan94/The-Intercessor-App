import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ─────────────────────────────────────────
// TESTIMONY CARD
// ─────────────────────────────────────────
function TestimonyCard({ testimony }) {
  const [expanded, setExpanded] = useState(false);

  const isLong = testimony.testimony.length > 200;
  const displayText =
    isLong && !expanded
      ? testimony.testimony.slice(0, 200) + "..."
      : testimony.testimony;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const initial = testimony.is_anonymous
    ? "?"
    : (testimony.author_name?.[0] ?? "?").toUpperCase();

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-6
                    flex flex-col gap-4 hover:border-[#7C3AED]
                    hover:shadow-sm transition-all duration-200">

      {/* Opening quote mark */}
      <span
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
        className="text-4xl text-[#EDE9FE] leading-none select-none"
      >
        "
      </span>

      {/* Testimony text */}
      <p className="text-sm text-[#52525B] leading-relaxed -mt-2">
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1.5 text-[#7C3AED] text-xs font-medium
                       hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>

      {/* Author footer */}
      <div className="flex items-center justify-between mt-auto pt-4
                      border-t border-[#E4E4E7]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center
                          justify-center text-[#7C3AED] text-xs font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#18181B]">
              {testimony.is_anonymous ? "Anonymous" : testimony.author_name}
            </p>
            <p className="text-[11px] text-[#A1A1AA]">
              {testimony.author_location ?? "Global"}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-[#A1A1AA]">
          {formatDate(testimony.created_at)}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SUBMIT TESTIMONY MODAL
// ─────────────────────────────────────────
function TestimonyModal({ onClose, onSubmit }) {
  const { user } = useAuth();
  const [testimony, setTestimony]     = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [submitted, setSubmitted]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testimony.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/testimonies", {
        testimony,
        is_anonymous: isAnonymous,
      });
      onSubmit(res.data);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to submit testimony. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#A1A1AA]
                     hover:text-[#18181B] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Success state ── */}
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-[#EDE9FE] flex
                            items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#7C3AED]" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl font-semibold text-[#18181B] mb-2"
            >
              Thank You
            </h3>
            <p className="text-sm text-[#52525B] mb-6 leading-relaxed">
              Your testimony has been shared with the community.
              May it build the faith of many.
            </p>
            <button
              onClick={onClose}
              className="bg-[#18181B] hover:bg-[#27272A] text-white
                         text-sm font-medium px-8 py-2.5 rounded-lg
                         transition-colors"
            >
              Close
            </button>
          </div>

        ) : (
          <>
            <h3
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl font-semibold text-[#18181B] mb-1"
            >
              Share Your Testimony
            </h3>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Your story of answered prayer can build someone else's faith today.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200
                              rounded-lg px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Testimony textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#18181B]
                                  uppercase tracking-wider mb-2">
                  Your Testimony
                </label>
                <textarea
                  required
                  rows={5}
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
                  type="checkbox"
                  id="anon-modal"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-0.5 w-4 h-4 cursor-pointer"
                />
                <div>
                  <label
                    htmlFor="anon-modal"
                    className="text-sm font-medium text-[#18181B] cursor-pointer"
                  >
                    Share anonymously
                  </label>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Your name will be hidden. Location may still appear.
                  </p>
                </div>
              </div>

              {/* Preview */}
              <p className="text-xs text-[#A1A1AA]">
                Will appear as:{" "}
                <span className="text-[#7C3AED] font-medium">
                  {isAnonymous ? "Anonymous" : (user?.name ?? "You")}
                </span>
                {user?.location ? ` · ${user.location}` : ""}
              </p>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                           text-sm font-semibold py-3 rounded-lg
                           transition-colors duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none"
                      viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12"
                        r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Share Testimony"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// LOCKED TOOLTIP
// Shown when user has no prayers yet
// ─────────────────────────────────────────
function LockedTooltip({ onClose }) {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white border
                    border-[#E4E4E7] rounded-xl shadow-lg p-4 w-64 z-10">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-[#A1A1AA]
                   hover:text-[#18181B] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round"
            strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <p className="text-xs font-semibold text-[#18181B] mb-1">
        One step away
      </p>
      <p className="text-xs text-[#52525B] leading-relaxed mb-2">
        Submit at least one prayer request first to unlock testimonies.
      </p>
      <Link to="/prayer-feed"
        className="text-xs font-medium text-[#7C3AED] hover:underline">
        Submit a prayer →
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────
// TESTIMONIES PAGE
// ─────────────────────────────────────────
function Testimonies() {
  const { user, hasPrayers }            = useAuth();
  const [testimonies, setTestimonies]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [showLocked, setShowLocked]     = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);
  const [filter, setFilter]             = useState("all");

  // Fetch all testimonies on mount
  useEffect(() => {
    api
      .get("/testimonies")
      .then((res) => setTestimonies(res.data))
      .catch((err) => console.error("Failed to fetch testimonies:", err))
      .finally(() => setLoading(false));
  }, []);

  // Add new testimony to top of list
  const handleNewTestimony = (newTestimony) => {
    setTestimonies((prev) => [newTestimony, ...prev]);
    setVisibleCount((prev) => prev + 1);
  };

  // Apply filter
  const filtered = testimonies.filter((t) => {
    if (filter === "anonymous") return t.is_anonymous === true;
    if (filter === "named")     return t.is_anonymous === false;
    return true;
  });

  // Stats computed from full list
  const totalCount     = testimonies.length;
  const namedCount     = testimonies.filter((t) => !t.is_anonymous).length;
  const anonymousCount = testimonies.filter((t) => t.is_anonymous).length;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ══════════════════════════════════════════
            PAGE HEADER
        ══════════════════════════════════════════ */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end
                        justify-between gap-6">

          {/* Left — title */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span className="text-xs font-medium text-[#7C3AED]
                               uppercase tracking-widest">
                Answered Prayers
              </span>
            </div>
            <h1
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-4xl md:text-5xl font-semibold
                         text-[#18181B] mb-2"
            >
              Community Testimonies
            </h1>
            <p className="text-sm text-[#52525B] max-w-lg leading-relaxed">
              Real stories of faith and God's faithfulness from believers
              across the world. Every testimony here is proof that prayer works.
            </p>
          </div>

          {/* Right — share button (3 states) */}
          <div className="relative flex-shrink-0">

            {/* State 1: Guest */}
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm
                           font-semibold text-white bg-[#7C3AED]
                           hover:bg-[#5B21B6] px-6 py-2.5 rounded-lg
                           transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Share Your Testimony
              </Link>
            )}

            {/* State 2: Logged in, no prayers yet */}
            {user && !hasPrayers && (
              <>
                <button
                  onClick={() => setShowLocked(!showLocked)}
                  className="inline-flex items-center gap-2 text-sm
                             font-semibold text-[#A1A1AA] border
                             border-[#E4E4E7] px-6 py-2.5 rounded-lg
                             cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0
                         00-2-2H6a2 2 0 00-2 2v6a2 2 0 002
                         2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Share Testimony 🔒
                </button>
                {showLocked && (
                  <LockedTooltip onClose={() => setShowLocked(false)} />
                )}
              </>
            )}

            {/* State 3: Logged in with prayers — fully unlocked */}
            {user && hasPrayers && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 text-sm
                           font-semibold text-white bg-[#7C3AED]
                           hover:bg-[#5B21B6] px-6 py-2.5 rounded-lg
                           transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Share Your Testimony
              </button>
            )}

          </div>
        </div>

        {/* ══════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-px bg-[#E4E4E7] border
                        border-[#E4E4E7] rounded-xl overflow-hidden mb-10">
          {[
            { label: "Total Testimonies", value: totalCount     },
            { label: "Named",             value: namedCount     },
            { label: "Anonymous",         value: anonymousCount },
          ].map((s) => (
            <div key={s.label} className="bg-white px-6 py-5 text-center">
              <p
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl font-semibold text-[#18181B]
                           leading-none mb-1"
              >
                {loading ? "—" : s.value}
              </p>
              <p className="text-xs text-[#A1A1AA] uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            FILTER TABS
        ══════════════════════════════════════════ */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {[
            { key: "all",       label: "All Testimonies" },
            { key: "named",     label: "Named"           },
            { key: "anonymous", label: "Anonymous"       },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                setVisibleCount(9);
              }}
              className={
                "text-xs font-semibold px-4 py-2 rounded-lg " +
                "transition-colors duration-200 " +
                (filter === tab.key
                  ? "bg-[#EDE9FE] text-[#7C3AED]"
                  : "text-[#52525B] border border-[#E4E4E7] " +
                    "hover:border-[#7C3AED] hover:text-[#7C3AED]")
              }
            >
              {tab.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#A1A1AA]">
            {filtered.length} testimon{filtered.length !== 1 ? "ies" : "y"}
          </span>
        </div>

        {/* ══════════════════════════════════════════
            LOADING SKELETON
        ══════════════════════════════════════════ */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2
                          lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#FAFAFA] border border-[#E4E4E7]
                           rounded-xl p-6 animate-pulse h-48"
              />
            ))}
          </div>
        )}

        {/* ══════════════════════════════════════════
            EMPTY STATE
        ══════════════════════════════════════════ */}
        {!loading && filtered.length === 0 && (
          <div className="border border-dashed border-[#E4E4E7]
                          rounded-xl p-16 text-center">
            <p
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl font-semibold text-[#18181B] mb-2"
            >
              No testimonies yet
            </p>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Be the first to share how God answered your prayer.
            </p>
            {user && hasPrayers && (
              <button
                onClick={() => setShowModal(true)}
                className="text-sm font-semibold text-white bg-[#7C3AED]
                           hover:bg-[#5B21B6] px-6 py-2.5 rounded-lg
                           transition-colors duration-200"
              >
                Share Your Testimony
              </button>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TESTIMONIES GRID
        ══════════════════════════════════════════ */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2
                            lg:grid-cols-3 gap-4">
              {filtered.slice(0, visibleCount).map((t) => (
                <TestimonyCard key={t.id} testimony={t} />
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  className="text-sm font-medium text-[#52525B] border
                             border-[#E4E4E7] px-8 py-2.5 rounded-lg
                             hover:border-[#18181B] hover:text-[#18181B]
                             transition-all duration-200"
                >
                  Load More Testimonies
                </button>
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════
            GUEST INVITE BANNER
        ══════════════════════════════════════════ */}
        {!user && (
          <div className="mt-14 bg-[#FAFAFA] border border-[#E4E4E7]
                          rounded-xl p-8 md:p-12 text-center">
            <h3
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-2xl font-semibold text-[#18181B] mb-2"
            >
              Have a testimony to share?
            </h3>
            <p className="text-sm text-[#52525B] max-w-md mx-auto
                          leading-relaxed mb-6">
              Join the community, submit your first prayer request, and
              when God answers — share it with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-[#7C3AED]
                           hover:bg-[#5B21B6] px-8 py-2.5 rounded-lg
                           transition-colors duration-200"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#52525B] border
                           border-[#E4E4E7] px-8 py-2.5 rounded-lg
                           hover:border-[#18181B] hover:text-[#18181B]
                           transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Submit Modal */}
      {showModal && (
        <TestimonyModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewTestimony}
        />
      )}
    </div>
  );
}

export default Testimonies;