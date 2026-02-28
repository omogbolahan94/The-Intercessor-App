// ─────────────────────────────────────────
// MOCK DATA — placeholder until backend is ready
// 🔧 TODO: Replace each dataset with real API calls
// ─────────────────────────────────────────

// Simulates the logged-in user's own prayer requests
// 🔧 TODO: GET /api/users/me/prayers
export const MOCK_MY_PRAYERS = [
  {
    id:        1,
    title:     "Healing for my mother",
    body:      "My mother has been diagnosed with a serious illness. Please intercede for her complete healing and for strength for our family during this time.",
    location:  "Lagos, Nigeria",
    date:      "Feb 20, 2025",
    prayerCount: 34,   // Number of people who prayed for this
    status:    "active",   // active | answered
  },
  {
    id:        2,
    title:     "Financial breakthrough",
    body:      "I have been out of work for three months. I am trusting God for a breakthrough and for provision for my family.",
    location:  "Lagos, Nigeria",
    date:      "Feb 10, 2025",
    prayerCount: 21,
    status:    "active",
  },
  {
    id:        3,
    title:     "Peace in my marriage",
    body:      "My spouse and I have been going through a very difficult season. I pray for restoration, understanding, and God's peace over our home.",
    location:  "Lagos, Nigeria",
    date:      "Jan 28, 2025",
    prayerCount: 47,
    status:    "answered",
  },
  {
    id:        4,
    title:     "Career guidance",
    body:      "I have two job offers and I don't know which to take. I need divine direction and clarity on the path God wants me to follow.",
    location:  "Lagos, Nigeria",
    date:      "Jan 15, 2025",
    prayerCount: 18,
    status:    "answered",
  },
];

// Daily scripture recommendation
// 🔧 TODO: GET /api/scripture/daily — backend will pick this based on user's prayer topics
export const MOCK_DAILY_SCRIPTURE = {
  verse:     "Philippians 4:6-7",
  text:      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
  theme:     "Peace & Trust",
  reasoning: "Based on your recent prayer requests, this scripture speaks directly to your need for peace and God's provision during uncertainty.",
};