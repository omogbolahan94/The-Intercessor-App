import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-6
                    hover:border-[#7C3AED]/30 hover:shadow-sm
                    transition-all duration-200">
      <p className="text-xs font-medium text-[#A1A1AA] uppercase
                    tracking-widest mb-3">
        {label}
      </p>
      <p style={{fontFamily: "'Cormorant Garamond', serif"}}
        className="text-4xl font-semibold text-[#18181B] leading-none mb-1">
        {value}
      </p>
      {sub && <p className="text-xs text-[#A1A1AA] mt-1">{sub}</p>}
    </div>
  );
}

// ── Scripture Card ─────────────────────────────────────────
function ScriptureCard({ scripture, loading }) {
  const [showReason, setShowReason] = useState(false);

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-6
                      animate-pulse">
        <div className="h-3 bg-[#E4E4E7] rounded w-24 mb-4" />
        <div className="h-4 bg-[#E4E4E7] rounded w-full mb-2" />
        <div className="h-4 bg-[#E4E4E7] rounded w-3/4" />
      </div>
    );
  }

  if (!scripture) return null;

  return (
    <div className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl p-6">
      <p className="text-xs font-medium text-[#7C3AED] uppercase
                    tracking-widest mb-4">
        Your Daily Scripture
      </p>
      <div className="mb-4">
        <p style={{fontFamily: "'Cormorant Garamond', serif"}}
          className="text-xl font-medium text-[#18181B] italic
                     leading-snug mb-2">
          "{scripture.text}"
        </p>
        <p className="text-xs font-semibold text-[#7C3AED] uppercase
                      tracking-wider">
          {scripture.verse}
        </p>
      </div>
      {scripture.theme && (
        <p className="text-xs text-[#A1A1AA] mb-3">
          Theme: <span className="text-[#52525B]">{scripture.theme}</span>
        </p>
      )}
      <button
        onClick={() => setShowReason(!showReason)}
        className="text-xs font-medium text-[#52525B] hover:text-[#7C3AED]
                   transition-colors underline">
        {showReason ? "Hide" : "Why this was recommended"}
      </button>
      {showReason && scripture.reasoning && (
        <p className="text-xs text-[#52525B] leading-relaxed mt-2
                      bg-white border border-[#E4E4E7] rounded-lg p-3">
          {scripture.reasoning}
        </p>
      )}
    </div>
  );
}

// ── Prayer Card ────────────────────────────────────────────
function MyPrayerCard({ prayer, onStatusUpdate }) {
  const [updating, setUpdating] = useState(false);

  const handleMarkAnswered = async () => {
    setUpdating(true);
    try {
      await api.put(`/prayers/${prayer.id}/status`, { status: "answered" });
      onStatusUpdate(prayer.id, "answered");
    } catch (err) {
      console.error("Failed to update prayer status", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-xl p-5
                    hover:border-[#7C3AED]/30 hover:shadow-sm
                    transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
          className="text-lg font-semibold text-[#18181B] leading-snug">
          {prayer.title}
        </h3>
        <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5
                          py-1 rounded-full uppercase tracking-wider
                          ${prayer.status === "answered"
                            ? "bg-green-50 text-green-600"
                            : "bg-[#EDE9FE] text-[#7C3AED]"}`}>
          {prayer.status}
        </span>
      </div>

      {/* Body */}
      <p className="text-sm text-[#52525B] leading-relaxed mb-4 line-clamp-2">
        {prayer.body}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A1A1AA]">
            {prayer.prayer_count ?? 0} interceding
          </span>
          <span className="text-xs text-[#A1A1AA]">
            {prayer.category}
          </span>
        </div>
        {prayer.status === "active" && (
          <button
            onClick={handleMarkAnswered}
            disabled={updating}
            className="text-xs font-medium text-[#7C3AED] border
                       border-[#7C3AED]/30 px-3 py-1.5 rounded-lg
                       hover:bg-[#EDE9FE] transition-colors
                       disabled:opacity-50">
            {updating ? "Updating..." : "Mark Answered ✓"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────
function Dashboard() {
  const { user, userStats, refreshUser}   = useAuth();
  const navigate              = useNavigate();
  const [prayers, setPrayers] = useState([]);
  const [scripture, setScripture] = useState(null);
  const [prayersLoading, setPrayersLoading]     = useState(true);
  const [scriptureLoading, setScriptureLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch user's own prayers
  useEffect(() => {
    if (!user) return;
    api.get("/prayers/my-prayers")
      .then((res) => setPrayers(res.data))
      .catch((err) => console.error("Failed to fetch prayers", err))
      .finally(() => setPrayersLoading(false));
  }, [user]);

  // Fetch daily scripture
  useEffect(() => {
    if (!user) return;
    api.get("/scripture/daily")
      .then((res) => setScripture(res.data))
      .catch((err) => console.error("Failed to fetch scripture", err))
      .finally(() => setScriptureLoading(false));
  }, [user]);

  // Update a prayer's status locally after marking answered
  const handleStatusUpdate = (prayerId, newStatus) => {
    // Update the prayer card locally immediately
    setPrayers((prev) =>
      prev.map((p) => p.id === prayerId ? { ...p, status: newStatus } : p)
    );
    // Re-fetch user stats so the answered count increments
    refreshUser();
  };

  // Time-based greeting
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const activePrayers   = prayers.filter((p) => p.status === "active");
  const answeredPrayers = prayers.filter((p) => p.status === "answered");

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end
                        justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#7C3AED] uppercase
                          tracking-widest mb-2">
              Dashboard
            </p>
            <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-4xl md:text-5xl font-semibold text-[#18181B]">
              {getGreeting()},<br />{user.name.split(" ")[0]}
            </h1>
          </div>
          <Link to="/prayer-feed"
            className="inline-flex items-center justify-center
                       bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                       text-sm font-semibold px-6 py-2.5 rounded-lg
                       transition-colors duration-200 self-start md:self-auto">
            + New Prayer
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Prayers Submitted"
            value={userStats.prayersSubmitted}
            sub="total requests"
          />
          <StatCard
            label="Prayers Answered"
            value={userStats.prayersAnswered}
            sub="testimonies possible"
          />
          <StatCard
            label="Intercessions Made"
            value={userStats.intercessions}
            sub="others prayed for"
          />
        </div>

        {/* ── Daily Scripture ── */}
        <div className="mb-10">
          <ScriptureCard scripture={scripture} loading={scriptureLoading} />
        </div>

        {/* ── Active Prayers ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-2xl font-semibold text-[#18181B]">
              Active Prayers
            </h2>
            <span className="text-xs text-[#A1A1AA]">
              {activePrayers.length} request{activePrayers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {prayersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#FAFAFA] border border-[#E4E4E7]
                                          rounded-xl p-5 animate-pulse h-32" />
                ))}
              </div>
            ) : prayers.length === 0 ? (
              // No prayers at all — brand new user
              <div className="border border-dashed border-[#E4E4E7] rounded-xl
                              p-10 text-center">
                <p className="text-sm text-[#A1A1AA] mb-3">
                  You haven't submitted any prayer requests yet.
                </p>
                <Link to="/prayer-feed"
                  className="text-sm font-medium text-[#7C3AED] hover:underline">
                  Submit your first prayer →
                </Link>
              </div>
            ) : activePrayers.length === 0 ? (
              // Has prayers but all are answered
              <div className="border border-dashed border-[#E4E4E7] rounded-xl
                              p-10 text-center">
                <p className="text-sm text-[#A1A1AA] mb-3">
                  All your prayers have been answered. 🙏
                </p>
                <Link to="/prayer-feed"
                  className="text-sm font-medium text-[#7C3AED] hover:underline">
                  Submit a new prayer →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePrayers.map((prayer) => (
                  <MyPrayerCard
                    key={prayer.id}
                    prayer={prayer}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
        </div>

        {/* ── Answered Prayers ── */}
        {answeredPrayers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-2xl font-semibold text-[#18181B]">
                Answered Prayers
              </h2>
              <span className="text-xs text-[#A1A1AA]">
                {answeredPrayers.length} answered
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {answeredPrayers.map((prayer) => (
                <MyPrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;