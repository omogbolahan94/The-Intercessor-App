// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// // ─────────────────────────────────────────
// // CORE VALUES DATA
// // ─────────────────────────────────────────
// const VALUES = [
//   {
//     icon: "✦",
//     title: "Faith-Centred",
//     description:
//       "Everything we build is rooted in the belief that prayer changes things. We exist to make intercession accessible to every believer, everywhere.",
//   },
//   {
//     icon: "◎",
//     title: "Community First",
//     description:
//       "No one should carry their burdens alone. We build spaces where believers from every nation can stand together in agreement.",
//   },
//   {
//     icon: "⟡",
//     title: "Confidentiality",
//     description:
//       "We treat every prayer request with the utmost care and discretion. Anonymous sharing is always an option for those who need it.",
//   },
//   {
//     icon: "✧",
//     title: "Scripture-Grounded",
//     description:
//       "Our daily scripture recommendations ensure every member is rooted in the Word — not just in community, but in truth.",
//   },
// ];

// // Key scriptures shown in the mission section
// const SCRIPTURES = [
//   {
//     verse: "Matthew 18:20",
//     text:  "For where two or three gather in my name, there am I with them.",
//   },
//   {
//     verse: "James 5:16",
//     text:  "The prayer of a righteous person is powerful and effective.",
//   },
//   {
//     verse: "Philippians 4:6",
//     text:  "In every situation, by prayer and petition, present your requests to God.",
//   },
// ];

// // ─────────────────────────────────────────
// // ABOUT PAGE
// // ─────────────────────────────────────────
// function About() {
//   const { user } = useAuth();

//   return (
//     <div className="bg-white">

//       {/* ══════════════════════════════════════════
//           HERO
//       ══════════════════════════════════════════ */}
//       <section className="max-w-6xl mx-auto px-6 pt-20 pb-20">
//         <div className="max-w-3xl">

//           {/* Eyebrow label */}
//           <div className="flex items-center gap-2 mb-6">
//             <div className="w-px h-4 bg-[#7C3AED]" />
//             <span className="text-xs font-medium text-[#7C3AED] uppercase
//                              tracking-widest">
//               Our Story
//             </span>
//           </div>

//           {/* Headline */}
//           <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
//             className="text-5xl md:text-6xl font-semibold text-[#18181B]
//                        leading-tight tracking-tight mb-6">
//             Built on Prayer,<br />
//             <span className="text-[#7C3AED]">Sustained by Faith</span>
//           </h1>

//           {/* Opening paragraph */}
//           <p className="text-lg text-[#52525B] leading-relaxed max-w-2xl">
//             The Intercessors was born out of a simple conviction — that the
//             Church is stronger when it prays together. We created this platform
//             to connect believers across every nation, culture and background
//             in the ancient and powerful practice of intercession.
//           </p>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           MISSION + SCRIPTURES
//       ══════════════════════════════════════════ */}
//       <section className="border-y border-[#E4E4E7]">
//         <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

//             {/* Left — Mission text */}
//             <div>
//               <p className="text-xs font-medium text-[#7C3AED] uppercase
//                             tracking-widest mb-4">
//                 Our Mission
//               </p>
//               <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
//                 className="text-3xl md:text-4xl font-semibold text-[#18181B]
//                            leading-snug mb-4">
//                 To unite believers worldwide through the power of prayer
//               </h2>
//               <p className="text-sm text-[#52525B] leading-relaxed">
//                 We believe intercession is one of the most powerful forces
//                 available to the Church. When believers from Lagos to London,
//                 from Manila to Montreal stand in agreement, heaven responds.
//                 The Intercessors exists to make that connection possible —
//                 anytime, anywhere, for anyone.
//               </p>
//             </div>

//             {/* Right — Scripture pull quotes */}
//             <div className="flex flex-col gap-6">
//               {SCRIPTURES.map((s) => (
//                 <div key={s.verse}
//                   className="border-l-2 border-[#7C3AED] pl-5">
//                   <p style={{fontFamily: "'Cormorant Garamond', serif"}}
//                     className="text-lg font-medium text-[#18181B]
//                                leading-snug italic mb-1">
//                     "{s.text}"
//                   </p>
//                   <p className="text-xs text-[#A1A1AA] font-medium
//                                 uppercase tracking-wider">
//                     — {s.verse}
//                   </p>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           CORE VALUES
//       ══════════════════════════════════════════ */}
//       <section className="max-w-6xl mx-auto px-6 py-24">
//         <div className="mb-14">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-px h-4 bg-[#7C3AED]" />
//             <span className="text-xs font-medium text-[#7C3AED] uppercase
//                              tracking-widest">
//               What We Stand For
//             </span>
//           </div>
//           <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
//             className="text-4xl md:text-5xl font-semibold text-[#18181B]">
//             Our Core Values
//           </h2>
//         </div>

//         {/* Values — bordered grid, same pattern as features on Home */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E4E4E7]
//                         border border-[#E4E4E7] rounded-xl overflow-hidden">
//           {VALUES.map((value) => (
//             <div key={value.title}
//               className="bg-white p-8 hover:bg-[#FAFAFA]
//                          transition-colors duration-200">
//               <span className="text-2xl text-[#7C3AED] block mb-4">
//                 {value.icon}
//               </span>
//               <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
//                 className="text-xl font-semibold text-[#18181B] mb-2">
//                 {value.title}
//               </h3>
//               <p className="text-sm text-[#52525B] leading-relaxed">
//                 {value.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           HOW IT WORKS — Numbered steps
//       ══════════════════════════════════════════ */}
//       <section className="border-t border-[#E4E4E7] bg-[#FAFAFA] py-24 px-6">
//         <div className="max-w-6xl mx-auto">

//           <div className="mb-14">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-px h-4 bg-[#7C3AED]" />
//               <span className="text-xs font-medium text-[#7C3AED] uppercase
//                                tracking-widest">
//                 Getting Started
//               </span>
//             </div>
//             <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
//               className="text-4xl md:text-5xl font-semibold text-[#18181B]">
//               How It Works
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 step:        "01",
//                 title:       "Create Your Account",
//                 description: "Register for free in under a minute. Share your name, email and location so we can connect you with your regional community.",
//               },
//               {
//                 step:        "02",
//                 title:       "Submit a Prayer Request",
//                 description: "Share your prayer need with the global community. Choose a category and let believers around the world stand with you in intercession.",
//               },
//               {
//                 step:        "03",
//                 title:       "Receive & Give Intercession",
//                 description: "Pray for others in the feed and receive daily scripture recommendations personalised to your specific prayer requests.",
//               },
//             ].map((item) => (
//               <div key={item.step} className="flex flex-col gap-4">

//                 {/* Large decorative step number */}
//                 <span style={{fontFamily: "'Cormorant Garamond', serif"}}
//                   className="text-6xl font-semibold text-[#EDE9FE] leading-none">
//                   {item.step}
//                 </span>

//                 {/* Purple divider line */}
//                 <div className="w-8 h-px bg-[#7C3AED]" />

//                 <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
//                   className="text-xl font-semibold text-[#18181B]">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm text-[#52525B] leading-relaxed">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           AI SCRIPTURE FEATURE HIGHLIGHT
//       ══════════════════════════════════════════ */}
//       <section className="border-t border-[#E4E4E7] py-24 px-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

//             {/* Left — explanation */}
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-px h-4 bg-[#7C3AED]" />
//                 <span className="text-xs font-medium text-[#7C3AED] uppercase
//                                  tracking-widest">
//                   AI-Powered
//                 </span>
//               </div>
//               <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
//                 className="text-4xl font-semibold text-[#18181B]
//                            leading-snug mb-4">
//                 Scripture Personalised<br />to Your Prayer
//               </h2>
//               <p className="text-sm text-[#52525B] leading-relaxed mb-4">
//                 Every day, our AI analyses your recent prayer requests and
//                 recommends a Bible scripture that speaks directly to your
//                 specific situation — not a generic verse, but one chosen
//                 personally for you.
//               </p>
//               <p className="text-sm text-[#52525B] leading-relaxed">
//                 Each recommendation includes a brief explanation of why that
//                 scripture was chosen for your situation, helping you connect
//                 the Word of God to your real life circumstances.
//               </p>
//             </div>

//             {/* Right — sample scripture card */}
//             <div className="border border-[#E4E4E7] rounded-xl p-8 bg-[#FAFAFA]">

//               {/* Card label */}
//               <p className="text-xs font-medium text-[#7C3AED] uppercase
//                             tracking-widest mb-6">
//                 Example Daily Scripture
//               </p>

//               {/* Scripture quote */}
//               <div className="border-l-2 border-[#7C3AED] pl-5 mb-5">
//                 <p style={{fontFamily: "'Cormorant Garamond', serif"}}
//                   className="text-xl font-medium text-[#18181B] italic
//                              leading-snug mb-2">
//                   "For I know the plans I have for you, declares the Lord,
//                   plans to prosper you and not to harm you, plans to give
//                   you hope and a future."
//                 </p>
//                 <p className="text-xs text-[#A1A1AA] font-medium uppercase
//                               tracking-wider">
//                   — Jeremiah 29:11
//                 </p>
//               </div>

//               {/* Reasoning box */}
//               <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
//                 <p className="text-xs font-semibold text-[#18181B] mb-1 uppercase
//                               tracking-wider">
//                   Why this was recommended
//                 </p>
//                 <p className="text-xs text-[#52525B] leading-relaxed">
//                   Based on your prayer for career guidance and uncertainty
//                   about the future, this scripture speaks directly to God's
//                   sovereign plan over your life and work.
//                 </p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           BOTTOM CTA
//       ══════════════════════════════════════════ */}
//       <section className="border-t border-[#E4E4E7] py-24 px-6">
//         <div className="max-w-2xl mx-auto text-center">
//           <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
//             className="text-4xl md:text-5xl font-semibold text-[#18181B] mb-4">
//             Ready to Join Us?
//           </h2>
//           <p className="text-sm text-[#52525B] leading-relaxed mb-8">
//             Join thousands of believers who are already praying together.
//             It's free and takes less than a minute to get started.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             {!user ? (
//               <>
//                 {/* Primary — purple */}
//                 <Link to="/register"
//                   className="inline-flex items-center justify-center
//                              bg-[#7C3AED] hover:bg-[#5B21B6] text-white
//                              text-sm font-semibold px-8 py-3 rounded-lg
//                              transition-colors duration-200 shadow-sm">
//                   Create Free Account
//                 </Link>
//                 {/* Secondary — dark */}
//                 <Link to="/login"
//                   className="inline-flex items-center justify-center
//                              bg-[#18181B] hover:bg-[#27272A] text-white
//                              text-sm font-semibold px-8 py-3 rounded-lg
//                              transition-colors duration-200">
//                   Sign In
//                 </Link>
//               </>
//             ) : (
//               <Link to="/prayer-feed"
//                 className="inline-flex items-center justify-center
//                            bg-[#7C3AED] hover:bg-[#5B21B6] text-white
//                            text-sm font-semibold px-8 py-3 rounded-lg
//                            transition-colors duration-200 shadow-sm">
//                 Go to Prayer Feed →
//               </Link>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           FOOTER
//       ══════════════════════════════════════════ */}
//       <footer className="border-t border-[#E4E4E7] py-8 px-6">
//         <div className="max-w-6xl mx-auto flex flex-col sm:flex-row
//                         items-center justify-between gap-4">
//           <div className="flex items-center gap-2">
//             <svg viewBox="0 0 28 28" fill="none"
//               className="w-5 h-5 text-[#7C3AED]">
//               <rect x="12" y="2" width="4" height="24" rx="1.5"
//                 fill="currentColor"/>
//               <rect x="4" y="9" width="20" height="4" rx="1.5"
//                 fill="currentColor"/>
//             </svg>
//             <span style={{fontFamily: "'Cormorant Garamond', serif"}}
//               className="text-sm font-medium text-[#18181B]">
//               The Intercessors
//             </span>
//           </div>
//           <p className="text-xs text-[#A1A1AA]">
//             © {new Date().getFullYear()} The Intercessors. Built with faith & love.
//           </p>
//         </div>
//       </footer>

//     </div>
//   );
// }

// export default About;


import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────
// CORE VALUES DATA
// ─────────────────────────────────────────
const VALUES = [
  {
    icon: "✦",
    title: "Faith-Centred",
    description:
      "Everything we build is rooted in the belief that prayer changes things. We exist to make intercession accessible to every believer, everywhere.",
  },
  {
    icon: "◎",
    title: "Community First",
    description:
      "No one should carry their burdens alone. We build spaces where believers from every nation can stand together in agreement.",
  },
  {
    icon: "⟡",
    title: "Confidentiality",
    description:
      "We treat every prayer request with the utmost care and discretion. Anonymous sharing is always an option for those who need it.",
  },
  {
    icon: "✧",
    title: "Scripture-Grounded",
    description:
      "Our daily scripture recommendations ensure every member is rooted in the Word — not just in community, but in truth.",
  },
];

// Key scriptures shown in the mission section
const SCRIPTURES = [
  {
    verse: "Matthew 18:20",
    text:  "For where two or three gather in my name, there am I with them.",
  },
  {
    verse: "James 5:16",
    text:  "The prayer of a righteous person is powerful and effective.",
  },
  {
    verse: "Philippians 4:6",
    text:  "In every situation, by prayer and petition, present your requests to God.",
  },
];

// How it works steps
const STEPS = [
  {
    step:        "01",
    title:       "Create Your Account",
    description: "Register for free in under a minute. Share your name, email and location so we can connect you with your regional community.",
  },
  {
    step:        "02",
    title:       "Submit a Prayer Request",
    description: "Share your prayer need with the global community. Choose a category and let believers around the world stand with you in intercession.",
  },
  {
    step:        "03",
    title:       "Receive & Give Intercession",
    description: "Pray for others in the feed and receive daily scripture recommendations personalised to your specific prayer requests.",
  },
  {
    step:        "04",
    title:       "Share Your Testimony",
    description: "When God answers your prayer, come back and share your testimony with the community. Your story of faith could be the encouragement someone else needs today.",
  },
];

// ─────────────────────────────────────────
// SECTION LABEL COMPONENT
// Reusable eyebrow label — no left border,
// just a small purple dot + uppercase text
// ─────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Small purple dot — replaces the left border */}
      <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
      <span className="text-xs font-medium text-[#7C3AED] uppercase tracking-widest">
        {text}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────
function About() {
  const { user } = useAuth();

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════
          HERO — Two column with image on right
          Fills the empty right side with a photo
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div>
            <SectionLabel text="Our Story" />

            <h1 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-5xl md:text-6xl font-semibold text-[#18181B]
                         leading-tight tracking-tight mb-6">
              Built on Prayer,<br />
              <span className="text-[#7C3AED]">Sustained by Faith</span>
            </h1>

            <p className="text-base text-[#52525B] leading-relaxed mb-6">
              The Intercessors was born out of a simple conviction — that the
              Church is stronger when it prays together. We created this platform
              to connect believers across every nation, culture and background
              in the ancient and powerful practice of intercession.
            </p>

            <p className="text-base text-[#52525B] leading-relaxed">
              Whether you are facing a personal crisis, believing God for a
              breakthrough, or simply wanting to stand with others in prayer —
              this is your community. A place where faith is shared, burdens
              are lightened, and God is glorified.
            </p>
          </div>

          {/* Right — image filling the empty space */}
          <div className="relative hidden md:block">

            {/* Decorative background shape */}
            <div className="absolute -top-6 -right-6 w-full h-full
                            bg-[#EDE9FE] rounded-2xl" />

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg
                            aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80"
                alt="Community praying together"
                className="w-full h-full object-cover"
              />
              {/* Subtle dark overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t
                              from-black/30 via-transparent to-transparent" />

              {/* Floating quote card over the image */}
              <div className="absolute bottom-5 left-5 right-5
                              bg-white/95 backdrop-blur-sm rounded-xl p-4
                              shadow-lg">
                <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-sm font-medium text-[#18181B] italic
                             leading-snug mb-1">
                  "Again, truly I tell you that if two of you on earth agree
                  about anything they ask for, it will be done for them."
                </p>
                <p className="text-[11px] text-[#7C3AED] font-medium
                              uppercase tracking-wider">
                  — Matthew 18:19
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION + SCRIPTURES
          No left borders on scripture quotes —
          replaced with a clean italic style
      ══════════════════════════════════════════ */}
      <section className="border-y border-[#E4E4E7]">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left — Mission text */}
            <div>
              <SectionLabel text="Our Mission" />
              <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-3xl md:text-4xl font-semibold text-[#18181B]
                           leading-snug mb-4">
                To unite believers worldwide through the power of prayer
              </h2>
              <p className="text-sm text-[#52525B] leading-relaxed">
                We believe intercession is one of the most powerful forces
                available to the Church. When believers from Lagos to London,
                from Manila to Montreal stand in agreement, heaven responds.
                The Intercessors exists to make that connection possible —
                anytime, anywhere, for anyone.
              </p>
            </div>

            {/* Right — Scripture quotes
                No left border — clean card style instead */}
            <div className="flex flex-col gap-4">
              {SCRIPTURES.map((s, i) => (
                <div key={s.verse}
                  className="bg-[#FAFAFA] border border-[#E4E4E7] rounded-xl
                             px-5 py-4 hover:border-[#7C3AED]/30
                             hover:bg-white transition-all duration-200">
                  <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                    className="text-lg font-medium text-[#18181B] italic
                               leading-snug mb-2">
                    "{s.text}"
                  </p>
                  <p className="text-xs text-[#7C3AED] font-medium
                                uppercase tracking-wider">
                    {s.verse}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-14">
          <SectionLabel text="What We Stand For" />
          <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-4xl md:text-5xl font-semibold text-[#18181B]">
            Our Core Values
          </h2>
        </div>

        {/* Values — bordered grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E4E4E7]
                        border border-[#E4E4E7] rounded-xl overflow-hidden">
          {VALUES.map((value) => (
            <div key={value.title}
              className="bg-white p-8 hover:bg-[#FAFAFA]
                         transition-colors duration-200">
              <span className="text-2xl text-[#7C3AED] block mb-4">
                {value.icon}
              </span>
              <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-xl font-semibold text-[#18181B] mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-[#52525B] leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
          Now includes Step 04 — Share Your Testimony
      ══════════════════════════════════════════ */}
      <section className="border-t border-[#E4E4E7] bg-[#FAFAFA] py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-14">
            <SectionLabel text="Getting Started" />
            <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
              className="text-4xl md:text-5xl font-semibold text-[#18181B]">
              How It Works
            </h2>
          </div>

          {/* Steps — 4 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="flex flex-col gap-4">

                {/* Large decorative step number */}
                <span style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-6xl font-semibold text-[#EDE9FE] leading-none
                             select-none">
                  {item.step}
                </span>

                {/* Short purple line */}
                <div className="w-8 h-px bg-[#7C3AED]" />

                <h3 style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-xl font-semibold text-[#18181B]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          AI SCRIPTURE FEATURE
      ══════════════════════════════════════════ */}
      <section className="border-t border-[#E4E4E7] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* Left — explanation */}
            <div>
              <SectionLabel text="AI-Powered" />
              <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
                className="text-4xl font-semibold text-[#18181B]
                           leading-snug mb-4">
                Scripture Personalised<br />to Your Prayer
              </h2>
              <p className="text-sm text-[#52525B] leading-relaxed mb-4">
                Every day, our AI analyses your recent prayer requests and
                recommends a Bible scripture that speaks directly to your
                specific situation — not a generic verse, but one chosen
                personally for you.
              </p>
              <p className="text-sm text-[#52525B] leading-relaxed">
                Each recommendation includes a brief explanation of why that
                scripture was chosen for your situation, helping you connect
                the Word of God to your real life circumstances.
              </p>
            </div>

            {/* Right — sample scripture card */}
            <div className="border border-[#E4E4E7] rounded-xl p-8 bg-[#FAFAFA]">

              <p className="text-xs font-medium text-[#7C3AED] uppercase
                            tracking-widest mb-6">
                Example Daily Scripture
              </p>

              {/* Scripture — card style, no left border */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl
                              px-5 py-4 mb-4">
                <p style={{fontFamily: "'Cormorant Garamond', serif"}}
                  className="text-xl font-medium text-[#18181B] italic
                             leading-snug mb-2">
                  "For I know the plans I have for you, declares the Lord,
                  plans to prosper you and not to harm you, plans to give
                  you hope and a future."
                </p>
                <p className="text-xs text-[#7C3AED] font-medium
                              uppercase tracking-wider">
                  Jeremiah 29:11
                </p>
              </div>

              {/* Reasoning */}
              <div className="bg-white border border-[#E4E4E7] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#18181B] mb-1
                              uppercase tracking-wider">
                  Why this was recommended
                </p>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  Based on your prayer for career guidance and uncertainty
                  about the future, this scripture speaks directly to God's
                  sovereign plan over your life and work.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════ */}
      <section className="border-t border-[#E4E4E7] py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{fontFamily: "'Cormorant Garamond', serif"}}
            className="text-4xl md:text-5xl font-semibold text-[#18181B] mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-sm text-[#52525B] leading-relaxed mb-8">
            Join thousands of believers who are already praying together.
            It's free and takes less than a minute to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user ? (
              <>
                {/* Primary — purple */}
                <Link to="/register"
                  className="inline-flex items-center justify-center
                             bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                             text-sm font-semibold px-8 py-3 rounded-lg
                             transition-colors duration-200 shadow-sm">
                  Create Free Account
                </Link>
                {/* Secondary — dark */}
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

    </div>
  );
}

export default About;