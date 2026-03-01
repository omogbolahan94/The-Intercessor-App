import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MOCK_FEED_PRAYERS,
  LOCATIONS,
  CATEGORIES,
} from "../data/mockdata";

// ─────────────────────────────────────────
// CUSTOM SELECT COMPONENT
// Replaces the native <select> with a fully
// styled dropdown we control completely
// ─────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);

  // Find the label to display for the current value
  const selectedLabel = options.find((o) =>
    (typeof o === "string" ? o : o.value) === value
  ) ?? placeholder;

  const displayLabel = typeof selectedLabel === "string"
    ? selectedLabel
    : selectedLabel?.label ?? placeholder;

  return (
    <div className="relative flex-1">

      {/* ── Trigger button — shows selected value ── */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-gray-200 
                   rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 
                   hover:border-purple-400 focus:outline-none focus:ring-2 
                   focus:ring-purple-500 focus:border-purple-500 transition-colors"
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>
          {displayLabel}
        </span>
        {/* Chevron icon — rotates when open */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 
                      flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Dropdown list ── */}
      {open && (
        <>
          {/* Invisible backdrop — clicking outside closes the dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <ul className="absolute z-20 mt-1 w-full bg-white border border-purple-100 
                         rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
            {options.map((option) => {
              const optValue = typeof option === "string" ? option : option.value;
              const optLabel = typeof option === "string" ? option : option.label;
              const isSelected = value === optValue;

              return (
                <li key={optValue}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(optValue);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                                duration-150 flex items-center justify-between
                                ${isSelected
                                  // Selected option — purple background
                                  ? "bg-purple-700 text-white font-semibold"
                                  // Unselected — hover with light purple
                                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                                }`}
                  >
                    {optLabel}
                    {/* Checkmark next to selected item */}
                    {isSelected && (
                      <svg className="w-4 h-4 flex-shrink-0" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// SUBMIT PRAYER MODAL
// Pops up when a logged-in user wants to submit a new prayer request
// ─────────────────────────────────────────
function SubmitPrayerModal({ onClose, onSubmit }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title:    "",
    body:     "",
    category: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.body.trim()) {
      return setError("Please fill in both the title and your prayer request.");
    }
    if (!formData.category) {
      return setError("Please select a category for your prayer.");
    }

    // Build the new prayer object
    // 🔧 TODO: Replace with POST /api/prayers when backend is ready
    const newPrayer = {
      id:          Date.now(),
      author:      user.name,
      location:    user.location,
      title:       formData.title,
      body:        formData.body,
      category:    formData.category,
      date:        new Date().toLocaleDateString("en-GB", {
                     day: "numeric", month: "short", year: "numeric"
                   }),
      prayerCount: 0,
    };

    onSubmit(newPrayer);
    setSubmitted(true);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
                 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 
                   relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                     transition-colors p-1"
          aria-label="Close">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Success screen ── */}
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-2">
              Prayer Submitted!
            </h3>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Your prayer request has been shared with the community.
            </p>
            <p className="text-sm text-purple-600 mb-6">
              The community will stand with you in intercession.
            </p>
            <button onClick={onClose}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
                         px-8 py-2.5 rounded-full transition-colors duration-200">
              Close
            </button>
          </div>

        ) : (

          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-purple-800">
                Submit a Prayer Request 🙏
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Share your need. The community will intercede with you.
              </p>
            </div>

            {/* Submitting as — shows user's name and location */}
            <div className="flex items-center gap-3 bg-purple-50 rounded-xl 
                            p-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center 
                              justify-center text-purple-700 text-xs font-bold flex-shrink-0">
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-400">📍 {user.location}</p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 
                              rounded-xl mb-4 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Prayer title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prayer Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Healing for my father"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             bg-white text-gray-700"
                >
                  <option value="">-- Select a category --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Prayer body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Prayer Request
                </label>
                <textarea
                  name="body"
                  required
                  rows={5}
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Share your prayer request in detail. The more you share, the better the community can intercede..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             resize-none text-gray-700 leading-relaxed"
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                  {formData.body.length} characters
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white
                           font-semibold py-3 rounded-full transition-colors 
                           duration-200 shadow-md"
              >
                Submit Prayer Request 🙏
              </button>

            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PRAYER FEED CARD COMPONENT
// Renders a single prayer request in the feed
// ─────────────────────────────────────────
function PrayerCard({ prayer, onIntercede }) {
  const { user }        = useAuth();
  // Track if THIS user has already prayed for this request
  const [prayed, setPrayed] = useState(false);

  const handleIntercede = () => {
    if (!user || prayed) return;
    setPrayed(true);
    onIntercede(prayer.id); // Notify parent to update the count
  };

  // Category badge colour mapping
  // Each category gets a subtle background colour
  const categoryColors = {
    Guidance:       "bg-blue-100 text-blue-700",
    Family:         "bg-pink-100 text-pink-700",
    Protection:     "bg-yellow-100 text-yellow-700",
    Healing:        "bg-green-100 text-green-700",
    Finance:        "bg-orange-100 text-orange-700",
    Salvation:      "bg-purple-100 text-purple-700",
    Health:         "bg-teal-100 text-teal-700",
    "Mental Health":"bg-indigo-100 text-indigo-700",
    Relationships:  "bg-rose-100 text-rose-700",
    "Work & Career":"bg-cyan-100 text-cyan-700",
    Education:      "bg-lime-100 text-lime-700",
    Other:          "bg-gray-100 text-gray-600",
  };

  const badgeClass = categoryColors[prayer.category] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100
                    hover:shadow-md hover:border-purple-200 transition-all duration-200">

      {/* Card header — author + location + category badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Author avatar */}
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center
                          justify-center text-purple-700 text-sm font-bold flex-shrink-0">
            {prayer.author[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{prayer.author}</p>
            <p className="text-xs text-gray-400">📍 {prayer.location}</p>
          </div>
        </div>
        {/* Category badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                          flex-shrink-0 ${badgeClass}`}>
          {prayer.category}
        </span>
      </div>

      {/* Prayer title */}
      <h3 className="font-bold text-gray-800 mb-2 leading-snug">
        {prayer.title}
      </h3>

      {/* Prayer body — clamped to 3 lines */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
        {prayer.body}
      </p>

      {/* Card footer — date + intercession button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{prayer.date}</span>

        {/* Intercede button */}
        {user ? (
          <button
            onClick={handleIntercede}
            disabled={prayed}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 
                        rounded-full transition-all duration-200
                        ${prayed
                          // After praying — green success state
                          ? "bg-green-100 text-green-700 cursor-default"
                          // Before praying — purple interactive state
                          : "bg-purple-100 text-purple-700 hover:bg-purple-700 hover:text-white"
                        }`}
          >
            <span>{prayed ? "✅" : "🙏"}</span>
            <span>{prayer.prayerCount} {prayed ? "Prayed" : "Intercede"}</span>
          </button>
        ) : (
          // Guest sees a link to login instead of the button
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2
                       rounded-full bg-purple-100 text-purple-700 
                       hover:bg-purple-700 hover:text-white transition-all duration-200"
          >
            🙏 {prayer.prayerCount} — Sign in to intercede
          </Link>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PRAYER FEED PAGE — Main component
// ─────────────────────────────────────────
function PrayerFeed() {
  const { user, markHasPrayers } = useAuth();

  // All prayers in the feed — starts with mock data
  const [prayers, setPrayers]       = useState(MOCK_FEED_PRAYERS);
  const [showModal, setShowModal]   = useState(false);

  // Filter state
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery]           = useState("");

  // How many prayers to show — "load more" increases this
  const [visibleCount, setVisibleCount] = useState(6);

  // Called when a user submits a new prayer from the modal
  const handleNewPrayer = (newPrayer) => {
    // Add to top of feed instantly
    setPrayers((prev) => [newPrayer, ...prev]);
    // Unlock testimony feature now that user has posted a prayer
    markHasPrayers();
  };

  // Called when a user clicks "Intercede" on a card
  // Increments that prayer's count by 1
  const handleIntercede = (prayerId) => {
    setPrayers((prev) =>
      prev.map((p) =>
        p.id === prayerId ? { ...p, prayerCount: p.prayerCount + 1 } : p
      )
    );
  };

  // ── Filter Logic ──
  // Applies location, category, and search filters to the full list
  const filteredPrayers = prayers.filter((prayer) => {
    const matchesLocation =
      selectedLocation === "All Locations" || prayer.location === selectedLocation;

    const matchesCategory =
      selectedCategory === "All" || prayer.category === selectedCategory;

    const matchesSearch =
      searchQuery === "" ||
      prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Prayer passes filter only if ALL three conditions are true
    return matchesLocation && matchesCategory && matchesSearch;
  });

  // Prayers to actually render (respects load more)
  const visiblePrayers = filteredPrayers.slice(0, visibleCount);

  // Reset visible count when filters change
  // so the user sees fresh results from the top
  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    setVisibleCount(6);
  };
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(6);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(6);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ══════════════════════════════════════════
            PAGE HEADER
        ══════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-center 
                        justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-900">
              🌍 Prayer Feed
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {prayers.length} prayer requests from the global community
            </p>
          </div>

          {/* Submit button — only for logged-in users */}
          {user ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
                         px-6 py-2.5 rounded-full transition-colors duration-200 
                         shadow-md text-sm whitespace-nowrap"
            >
              + Submit a Prayer
            </button>
          ) : (
            <Link
              to="/register"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold
                         px-6 py-2.5 rounded-full transition-colors duration-200 
                         shadow-md text-sm whitespace-nowrap"
            >
              Join to Submit a Prayer
            </Link>
          )}
        </div>

        {/* ══════════════════════════════════════════
            FILTERS BAR
        ══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 
                        p-4 mb-8 flex flex-col gap-4">

          {/* Search input */}
          <div className="relative">
            {/* Search icon */}
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 
                            text-gray-400 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search prayers by title, content or author..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl 
                         text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Location + Category dropdowns side by side */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Location filter — using custom dropdown */}
            <CustomSelect
                value={selectedLocation}
                onChange={handleLocationChange}
                options={LOCATIONS}
                placeholder="All Locations"
            />

            {/* Category filter — using custom dropdown */}
            <CustomSelect
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={["All", ...CATEGORIES]}
                placeholder="All Categories"
            />
                        
          </div>

          {/* Active filter summary — shows what is currently filtered */}
          {(selectedLocation !== "All Locations" ||
            selectedCategory !== "All" ||
            searchQuery !== "") && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Showing <span className="font-semibold text-purple-700">
                  {filteredPrayers.length}
                </span> result{filteredPrayers.length !== 1 ? "s" : ""}
              </span>
              {/* Clear all filters */}
              <button
                onClick={() => {
                  setSelectedLocation("All Locations");
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setVisibleCount(6);
                }}
                className="text-purple-600 hover:text-purple-800 font-semibold 
                           underline underline-offset-2 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            PRAYER CARDS GRID
        ══════════════════════════════════════════ */}
        {visiblePrayers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {visiblePrayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  onIntercede={handleIntercede}
                />
              ))}
            </div>

            {/* Load more button */}
            {visibleCount < filteredPrayers.length && (
              <div className="text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="border-2 border-purple-700 text-purple-700 font-semibold
                             px-10 py-2.5 rounded-full hover:bg-purple-700 hover:text-white
                             transition-all duration-200"
                >
                  Load More Prayers
                </button>
              </div>
            )}
          </>

        ) : (
          // ── Empty state — no results match the filters ──
          <div className="text-center py-20 bg-white rounded-2xl border 
                          border-purple-100 shadow-sm">
            <p className="text-4xl mb-3">🕊️</p>
            <p className="text-lg font-semibold text-gray-600">
              No prayers found
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              Try adjusting your filters or search term.
            </p>
            <button
              onClick={() => {
                setSelectedLocation("All Locations");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-purple-600 hover:text-purple-800 font-semibold 
                         text-sm underline underline-offset-2 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>

      {/* Submit Prayer Modal */}
      {showModal && (
        <SubmitPrayerModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPrayer}
        />
      )}
    </div>
  );
}

export default PrayerFeed;
