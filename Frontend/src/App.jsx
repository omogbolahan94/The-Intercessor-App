import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home         from "./pages/Home";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Dashboard    from "./pages/Dashboard";
import PrayerFeed   from "./pages/PrayerFeed";
import About        from "./pages/About";
import Testimonies  from "./pages/Testimonies";  
import Navbar       from "./components/Navbar";
import Footer      from "./components/Footer"; 

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-white">
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/prayer-feed"  element={<PrayerFeed />} />
          <Route path="/about"        element={<About />} />
          <Route path="/testimonies"  element={<Testimonies />} /> 
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-3xl font-bold text-gray-400">
                404 — Page Not Found
              </h1>
            </div>
          } />
        </Routes>
      </main>
      <Footer />   
    </BrowserRouter>
  );
}

export default App;