import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatPanel from "../components/ChatPanel";
import api from "../api/axios";

const CATEGORIES = [
  "All", "Health", "Family", "Finance", "Career",
  "Relationships", "Spiritual Growth", "Grief", "Other",
];

const LOCATIONS = [
  "All Regions",
  "West Africa", "East Africa", "Central Africa", "Southern Africa",
  "North Africa", "United Kingdom", "Europe", "North America",
  "South America", "South Asia", "East Asia", "Middle East",
  "Australia & Pacific", "Global / Other",
];

// ── Custom Select ──────────────────────────────────────────
function CustomSelect({ value, onChange, options }) {
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 border
                   border-[#E4E4E7] rounded-lg px-3 py-2 text-sm
                   text-[#18181B] bg-white hover:border-[#7C3AED]
                   transition-colors min-w-[140px]"
      >
        <span className="truncate">{value}</span>
        <svg className={`w-3.5 h-3.5 text-[#A1A1AA] flex-shrink-0
                         transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round"
            strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border
                        border-[#E4E4E7] rounded-xl shadow-lg z-20
                        min-w-[160px] py-1 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt} type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm
                          transition-colors
                          ${value === opt
                            ? "bg-[#EDE9FE] text-[#7C3AED] font-medium"
                            : "text-[#52525B] hover:bg-[#FAFAFA]"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Submit Prayer Modal ────────────────────────────────────
function SubmitPrayerModal({ onClose, onSubmit }) {
  const [title, setTitle]       = useState("");
  const [body, setBody]         = useState("");
  const [category, setCategory] = useState("Other");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/prayers", { title, body, category });
      onSubmit(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit prayer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                    flex items-center justify-center px-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8
                      relative"
        onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose}
          className="absolute top-5 right-5 text-[#A1A1AA]
                     hover:text-[#18181B] transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
          className="text-2xl font-semibold text-[#18181B] mb-1">
          Submit a Prayer Request
        </h3>
        <p className="text-sm text-[#A1A1AA] mb-6">
          Share your need. The community will stand with you.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg
                          px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#18181B]
                              uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              required value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your request"
              className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                         text-sm text-[#18181B] placeholder:text-[#A1A1AA]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18181B]
                              uppercase tracking-wider mb-2">
              Prayer Request
            </label>
            <textarea
              required rows={4} value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share the details of your prayer need..."
              className="w-full border border-[#E4E4E7] rounded-lg px-4 py-3
                         text-sm text-[#18181B] placeholder:text-[#A1A1AA]
                         resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18181B]
                              uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#E4E4E7] rounded-lg px-4
                           py-3 text-sm text-[#18181B] bg-white
                           appearance-none pr-10 cursor-pointer"
              >
                {CATEGORIES.filter(c => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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

          <button type="submit" disabled={loading}
            className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                       text-sm font-semibold py-3 rounded-lg
                       transition-colors duration-200
                       disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none"
                  viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Submitting...
              </>
            ) : "Submit Prayer Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Prayer Card ────────────────────────────────────────────
function PrayerCard({ prayer, onIntercede, currentUserId, onOpenChat }) {
  const [interceding, setInterceding] = useState(false);
  const hasInterceded = prayer.has_interceded ?? false;
  const isOwner       = prayer.user_id === currentUserId;

  const handleIntercede = async () => {
    if (hasInterceded || isOwner) return;
    setInterceding(true);
    try {
      await api.post(`/prayers/${prayer.id}/intercede`);
      onIntercede(prayer.id);
    } catch (err) {
      console.error("Intercede failed", err);
    } finally {
      setInterceding(false);
    }
  };

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-5
                    hover:border-[#7C3AED]/30 hover:shadow-sm
                    transition-all duration-200 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
          className="text-lg font-semibold text-[#18181B] leading-snug">
          {prayer.title}
        </h3>
        <span className="flex-shrink-0 text-[11px] font-medium px-2.5 py-1
                         bg-[#FAFAFA] border border-[#E4E4E7] rounded-full
                         text-[#52525B] uppercase tracking-wider">
          {prayer.category}
        </span>
      </div>

      {/* Body */}
      <p className="text-sm text-[#52525B] leading-relaxed line-clamp-3">
        {prayer.body}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3
                      border-t border-[#E4E4E7]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EDE9FE] flex items-center
                          justify-center text-[#7C3AED] text-[10px] font-semibold">
            {prayer.author_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-xs font-medium text-[#18181B]">
              {prayer.author_name}
            </p>
            <p className="text-[11px] text-[#A1A1AA]">
              {prayer.author_location}
            </p>
          </div>
        </div>

        {/* Intercede button */}
        {!currentUserId ? (
          <Link to="/login"
            className="text-xs font-medium text-[#7C3AED] hover:underline">
            Sign in to pray
          </Link>
        ) : isOwner ? (
          <span className="text-xs text-[#A1A1AA]">Your prayer</span>
        ) : (
          <button
            onClick={handleIntercede}
            disabled={hasInterceded || interceding}
            className={`flex items-center gap-1.5 text-xs font-semibold
                        px-3 py-1.5 rounded-lg transition-all duration-200
                        ${hasInterceded
                          ? "bg-green-50 text-green-600 border border-green-200"
                          : "border border-[#7C3AED]/30 text-[#7C3AED] hover:bg-[#EDE9FE]"}
                        disabled:cursor-not-allowed`}
          >
            {interceding ? (
              <svg className="w-3 h-3 animate-spin" fill="none"
                viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : hasInterceded ? "🙏 Prayed" : "🙏 Intercede"}
          </button>
        )}
      </div>

      {/* Prayer count */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-[#A1A1AA]">
          {prayer.prayer_count ?? 0} believer{prayer.prayer_count !== 1
            ? "s" : ""} interceding
        </p>

        {/* Chat button — only visible to intercessors and owner */}
        {currentUserId && (hasInterceded || isOwner) && (
          <button
            onClick={() => onOpenChat(prayer)}
            className="flex items-center gap-1 text-xs text-[#52525B]
                      hover:text-[#7C3AED] transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
                  8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72
                  C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9
                  3.582 9 8z"/>
            </svg>
            Chat
          </button>
        )}
      </div>
    </div>
  );
}

// ── Prayer Feed ────────────────────────────────────────────
function PrayerFeed() {
  const { user, markHasPrayers }    = useAuth();
  const [prayers, setPrayers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [activeChat, setActiveChat] = useState(null); // prayer object or null
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [location, setLocation]     = useState("All Regions");
  const [page, setPage]             = useState(0);
  const [hasMore, setHasMore]       = useState(true);
  const LIMIT = 6;

  // Fetch prayers when filters change
  useEffect(() => {
    setLoading(true);
    setPrayers([]);
    setPage(0);
    setHasMore(true);
    fetchPrayers(0, true);
  }, [category, location]);

  const fetchPrayers = async (skip = 0, replace = false) => {
    try {
      const params = new URLSearchParams();
      params.append("skip",  skip);
      params.append("limit", LIMIT);
      if (category !== "All")         params.append("category", category);
      if (location !== "All Regions") params.append("location", location);

      const res = await api.get(`/prayers?${params.toString()}`);
      const newPrayers = res.data;

      setPrayers((prev) => replace ? newPrayers : [...prev, ...newPrayers]);
      setHasMore(newPrayers.length === LIMIT);
    } catch (err) {
      console.error("Failed to fetch prayers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPrayers(nextPage * LIMIT);
  };

  const handleNewPrayer = (newPrayer) => {
    setPrayers((prev) => [newPrayer, ...prev]);
    markHasPrayers();
  };

  const handleIntercede = (prayerId) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === prayerId
          ? { ...p, has_interceded: true, prayer_count: (p.prayer_count ?? 0) + 1 }
          : p
      )
    );
  };

  // Client-side search filter
  const filtered = prayers.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q)  ||
      p.author_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end
                        justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#7C3AED] uppercase
                          tracking-widest mb-2">
              Community
            </p>
            <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-4xl md:text-5xl font-semibold text-[#18181B]">
              Prayer Feed
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Stand in intercession for the community
            </p>
          </div>
          {user && (
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center
                         bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                         text-sm font-semibold px-6 py-2.5 rounded-lg
                         transition-colors duration-200 self-start
                         md:self-auto">
              + Submit Prayer
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2
                            w-4 h-4 text-[#A1A1AA]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prayers..."
              className="w-full border border-[#E4E4E7] rounded-lg pl-9 pr-4
                         py-2 text-sm text-[#18181B]
                         placeholder:text-[#A1A1AA]"
            />
          </div>

          {/* Category filter */}
          <CustomSelect
            value={category}
            onChange={setCategory}
            options={CATEGORIES}
          />

          {/* Location filter */}
          <CustomSelect
            value={location}
            onChange={setLocation}
            options={LOCATIONS}
          />
        </div>

        {/* Prayers grid */}
        {loading && prayers.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-[#FAFAFA] border border-[#E4E4E7]
                                      rounded-xl p-5 animate-pulse h-48" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-[#E4E4E7] rounded-xl
                          p-16 text-center">
            <p className="text-sm text-[#A1A1AA] mb-2">
              No prayer requests found.
            </p>
            {user && (
              <button onClick={() => setShowModal(true)}
                className="text-sm font-medium text-[#7C3AED] hover:underline">
                Be the first to submit one →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onIntercede={handleIntercede}
                currentUserId={user?.id}
                onOpenChat={setActiveChat}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && filtered.length > 0 && (
          <div className="text-center mt-10">
            <button onClick={handleLoadMore}
              className="text-sm font-medium text-[#52525B]
                         border border-[#E4E4E7] px-8 py-2.5 rounded-lg
                         hover:border-[#18181B] hover:text-[#18181B]
                         transition-all duration-200">
              Load More
            </button>
          </div>
        )}

      </div>

      {showModal && (
        <SubmitPrayerModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPrayer}
        />
      )}
      {/* Chat panel — slides in from right */}
      {activeChat && (
        <ChatPanel
          prayer={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}

export default PrayerFeed;