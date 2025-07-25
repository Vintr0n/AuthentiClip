import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UploadVideo from "./pages/UploadVideo";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Verify from "./pages/Verify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        {/* Default fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
