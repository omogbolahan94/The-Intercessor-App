import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Page imports (we will create these files one by one) ---
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrayerFeed from "./pages/PrayerFeed";

// --- Component imports ---
import Navbar from "./components/Navbar";


function App() {
  return (
    // BrowserRouter enables the use of the browser's URL bar for navigation
    <BrowserRouter>

      {/* Navbar appears on every page since it's outside <Routes> */}
      <Navbar />

      {/* Main content area — changes based on the current URL */}
      <main className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes — anyone can visit these */}
          <Route path="/"         element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — only logged-in users should access these */}
          {/* We'll add real protection in the Auth Context step */}
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/prayer-feed" element={<PrayerFeed />} />

          {/* Catch-all: if the URL doesn't match anything above, show 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-3xl font-bold text-gray-400">
                404 — Page Not Found
              </h1>
            </div>
          } />
        </Routes>
      </main>

    </BrowserRouter>
  );
}


export default App;