import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MOCK_MY_PRAYERS, MOCK_DAILY_SCRIPTURE } from "../data/mockdata";

// ─────────────────────────────────────────
// STAT CARD COMPONENT
// Displays a single personal stat (e.g. prayers submitted)
// ─────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border 
                     border-purple-100 flex items-center gap-4`}>
      {/* Icon container — background colour passed as prop */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                       text-2xl flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-purple-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SCRIPTURE CARD COMPONENT
// Shows the daily scripture recommendation
// ─────────────────────────────────────────
function ScriptureCard({ scripture }) {
  // Toggle to show/hide the AI reasoning behind the recommendation
  const [showReason, setShowReason] = useState(false);

  return (
    <div className="bg-gradient-to-br from-purple-700 to-purple-900 
                    rounded-2xl p-6 text-white shadow-lg">

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest">
            Your Daily Scripture
          </p>
        </div>
        {/* Theme badge */}
        <span className="bg-purple-600/60 text-purple-100 text-xs font-medium 
                         px-3 py-1 rounded-full">
          {scripture.theme}
        </span>
      </div>

      {/* Scripture text */}
      <blockquote className="text-lg md:text-xl font-medium leading-relaxed 
                             mb-4 border-l-4 border-purple-400 pl-4">
        "{scripture.text}"
      </blockquote>

      {/* Verse reference */}
      <p className="text-purple-300 text-sm font-semibold mb-4">
        — {scripture.verse}
      </p>

      {/* Toggle to see why this scripture was recommended */}
      <button
        onClick={() => setShowReason(!showReason)}
        className="text-xs text-purple-300 hover:text-white transition-colors 
                   underline underline-offset-2"
      >
        {showReason ? "Hide" : "Why was this recommended for me?"}
      </button>

      {/* Reasoning — only visible when toggled */}
      {showReason && (
        <p className="mt-3 text-sm text-purple-200 bg-purple-800/50 
                      rounded-xl p-3 leading-relaxed">
          💡 {scripture.reasoning}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PRAYER REQUEST CARD COMPONENT
// Shows a single prayer from the user's own list
// ─────────────────────────────────────────
function MyPrayerCard({ prayer }) {
  const isAnswered = prayer.status === "answered";

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border transition-all 
                     duration-200 hover:shadow-md
                     ${isAnswered ? "border-green-200" : "border-purple-100"}`}>

      {/* Title row with status badge */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-semibold text-gray-800 text-sm leading-snug">
          {prayer.title}
        </h4>
        {/* Status badge — green for answered, purple for active */}
        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 
                          rounded-full ${isAnswered
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"}`}>
          {isAnswered ? "✅ Answered" : "🙏 Active"}
        </span>
      </div>

      {/* Prayer body — truncated to 2 lines */}
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
        {prayer.body}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{prayer.date}</span>
        {/* How many people prayed for this */}
        <span className="flex items-center gap-1">
          🙏 <span className="font-medium text-purple-600">{prayer.prayerCount}</span> intercessions
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// DASHBOARD PAGE — Main component
// ─────────────────────────────────────────
function Dashboard() {
  const { user, userStats } = useAuth();
  const navigate            = useNavigate();

  // Redirect to login if someone visits /dashboard without being logged in
  // This is our basic route protection before we add a proper ProtectedRoute wrapper
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Don't render anything if user is null (prevents flash before redirect)
  if (!user) return null;

  // Time-based greeting — changes depending on the hour
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Split into active and answered prayers for separate display
  const activePrayers   = MOCK_MY_PRAYERS.filter((p) => p.status === "active");
  const answeredPrayers = MOCK_MY_PRAYERS.filter((p) => p.status === "answered");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ══════════════════════════════════════════
            WELCOME HEADER
        ══════════════════════════════════════════ */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center 
                        justify-between gap-4">
          <div>
            {/* Time-based greeting */}
            <p className="text-sm text-purple-500 font-medium uppercase 
                          tracking-widest mb-1">
              {greeting}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900">
              {/* Show first name only */}
              {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              📍 {user.location}
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/prayer-feed"
              className="bg-purple-700 hover:bg-purple-800 text-white text-sm 
                         font-semibold px-5 py-2.5 rounded-full transition-colors 
                         duration-200 shadow-md"
            >
              🌍 Prayer Feed
            </Link>
            <Link
              to="/prayer-feed"
              className="border-2 border-purple-700 text-purple-700 text-sm 
                         font-semibold px-5 py-2.5 rounded-full hover:bg-purple-50 
                         transition-colors duration-200"
            >
              + New Prayer
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            STATS ROW
            Shows the user's personal activity at a glance
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon="🙏"
            label="Prayers Submitted"
            value={userStats.prayersSubmitted}
            color="bg-purple-100"
          />
          <StatCard
            icon="🤝"
            label="Prayers Interceded"
            value={userStats.prayersInterceded}
            color="bg-blue-100"
          />
          <StatCard
            icon="✨"
            label="Testimonies Shared"
            value={userStats.testimoniesShared}
            color="bg-green-100"
          />
        </div>

        {/* ══════════════════════════════════════════
            DAILY SCRIPTURE
            Takes up full width — it's a priority feature
        ══════════════════════════════════════════ */}
        <div className="mb-10">
          <ScriptureCard scripture={MOCK_DAILY_SCRIPTURE} />
        </div>

        {/* ══════════════════════════════════════════
            MY PRAYER REQUESTS
            Split into Active and Answered sections
        ══════════════════════════════════════════ */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-purple-900">My Prayer Requests</h2>
          <Link
            to="/prayer-feed"
            className="text-sm text-purple-600 hover:text-purple-800 
                       font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Active prayers */}
        {activePrayers.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase 
                          tracking-widest mb-3">
              Active
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activePrayers.map((prayer) => (
                <MyPrayerCard key={prayer.id} prayer={prayer} />
              ))}
            </div>
          </div>
        )}

        {/* Answered prayers */}
        {answeredPrayers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase 
                          tracking-widest mb-3">
              Answered 🎉
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {answeredPrayers.map((prayer) => (
                <MyPrayerCard key={prayer.id} prayer={prayer} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state — shown if user has no prayers yet */}
        {MOCK_MY_PRAYERS.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border 
                          border-purple-100 shadow-sm">
            <p className="text-4xl mb-3">🕊️</p>
            <p className="text-lg font-semibold text-gray-600">
              You haven't submitted any prayers yet.
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Share your first request with the community.
            </p>
            <Link
              to="/prayer-feed"
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold 
                         px-8 py-2.5 rounded-full transition-colors duration-200 text-sm"
            >
              Submit a Prayer Request
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
