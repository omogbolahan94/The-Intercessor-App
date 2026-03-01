// ─────────────────────────────────────────
// MOCK DATA — all placeholder data in one place
// 🔧 TODO: Replace each section with real API calls to FastAPI
// ─────────────────────────────────────────

// The logged-in user's own prayer requests
// 🔧 TODO: GET /api/users/me/prayers
export const MOCK_MY_PRAYERS = [
  {
    id:          1,
    title:       "Healing for my mother",
    body:        "My mother has been diagnosed with a serious illness. Please intercede for her complete healing and for strength for our family during this time.",
    location:    "Lagos, Nigeria",
    date:        "Feb 20, 2025",
    prayerCount: 34,
    status:      "active",
  },
  {
    id:          2,
    title:       "Financial breakthrough",
    body:        "I have been out of work for three months. I am trusting God for a breakthrough and for provision for my family.",
    location:    "Lagos, Nigeria",
    date:        "Feb 10, 2025",
    prayerCount: 21,
    status:      "active",
  },
  {
    id:          3,
    title:       "Peace in my marriage",
    body:        "My spouse and I have been going through a very difficult season. I pray for restoration, understanding, and God's peace over our home.",
    location:    "Lagos, Nigeria",
    date:        "Jan 28, 2025",
    prayerCount: 47,
    status:      "answered",
  },
  {
    id:          4,
    title:       "Career guidance",
    body:        "I have two job offers and I don't know which to take. I need divine direction and clarity on the path God wants me to follow.",
    location:    "Lagos, Nigeria",
    date:        "Jan 15, 2025",
    prayerCount: 18,
    status:      "answered",
  },
];

// Community-wide prayer feed
// 🔧 TODO: GET /api/prayers?location=all&page=1
export const MOCK_FEED_PRAYERS = [
  {
    id:          101,
    author:      "Grace M.",
    location:    "United Kingdom",
    title:       "Wisdom for an important decision",
    body:        "I am at a crossroads in my career and personal life. I need God's wisdom and clear direction. Please stand with me in prayer.",
    date:        "Feb 27, 2025",
    prayerCount: 23,
    category:    "Guidance",
  },
  {
    id:          102,
    author:      "Emmanuel O.",
    location:    "East Africa",
    title:       "Restoration of my family",
    body:        "My family has been torn apart by misunderstanding and bitterness. I am believing God for complete restoration and reconciliation.",
    date:        "Feb 26, 2025",
    prayerCount: 41,
    category:    "Family",
  },
  {
    id:          103,
    author:      "Priya S.",
    location:    "South Asia",
    title:       "Protection over my children",
    body:        "As a mother, I carry deep concern for the safety and spiritual wellbeing of my children. Please intercede with me.",
    date:        "Feb 25, 2025",
    prayerCount: 58,
    category:    "Protection",
  },
  {
    id:          104,
    author:      "David K.",
    location:    "North America",
    title:       "Healing from grief",
    body:        "I lost my father two months ago and the grief is overwhelming. I ask for prayer for God's comfort and peace over my heart.",
    date:        "Feb 24, 2025",
    prayerCount: 67,
    category:    "Healing",
  },
  {
    id:          105,
    author:      "Amina B.",
    location:    "West Africa",
    title:       "Breakthrough in my business",
    body:        "My small business has been struggling. I believe God for a turnaround and ask the community to agree with me in prayer.",
    date:        "Feb 23, 2025",
    prayerCount: 29,
    category:    "Finance",
  },
  {
    id:          106,
    author:      "Chen W.",
    location:    "East Asia",
    title:       "Salvation of my husband",
    body:        "I have been praying for my husband's salvation for seven years. I ask the body of Christ to join me in intercession for his heart.",
    date:        "Feb 22, 2025",
    prayerCount: 94,
    category:    "Salvation",
  },
  {
    id:          107,
    author:      "Maria L.",
    location:    "South America",
    title:       "Health for my community",
    body:        "There is a wave of illness spreading in our village. We have limited medical access. Please pray for healing and protection over us.",
    date:        "Feb 21, 2025",
    prayerCount: 112,
    category:    "Health",
  },
  {
    id:          108,
    author:      "James T.",
    location:    "Australia & Oceania",
    title:       "Peace during depression",
    body:        "I have been battling depression quietly for a long time. I am seeking help but also ask for the community's prayers for strength day by day.",
    date:        "Feb 20, 2025",
    prayerCount: 76,
    category:    "Mental Health",
  },
];

// Daily scripture recommendation
// 🔧 TODO: GET /api/scripture/daily
export const MOCK_DAILY_SCRIPTURE = {
  verse:     "Philippians 4:6-7",
  text:      "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
  theme:     "Peace & Trust",
  reasoning: "Based on your recent prayer requests, this scripture speaks directly to your need for peace and God's provision during uncertainty.",
};

// Locations used for filtering the prayer feed
// 🔧 TODO: Could be fetched dynamically from GET /api/locations
export const LOCATIONS = [
  "All Locations",
  "North America",
  "South America",
  "United Kingdom",
  "Europe",
  "West Africa",
  "East Africa",
  "South Africa",
  "Middle East",
  "South Asia",
  "Southeast Asia",
  "East Asia",
  "Australia & Oceania",
];

// Prayer categories — used in the submit form and as filter tags
export const CATEGORIES = [
  "Guidance",
  "Family",
  "Protection",
  "Healing",
  "Finance",
  "Salvation",
  "Health",
  "Mental Health",
  "Relationships",
  "Work & Career",
  "Education",
  "Other",
];