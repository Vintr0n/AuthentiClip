import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UploadVideo from './pages/UploadVideo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import About from './pages/About';
import FAQ from './pages/FAQ';

function App() {
  return (
    <div>
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
