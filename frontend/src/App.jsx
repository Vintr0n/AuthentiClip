import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import UploadVideo from './pages/UploadVideo';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import About from './pages/About';
import FAQ from './pages/FAQ';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <div>
      <Header />
      <div className="p-4">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected routes */}
          <Route
            path="/upload"
            element={
              <RequireAuth>
                <UploadVideo />
              </RequireAuth>
            }
          />
          <Route
            path="/verify"
            element={
              <RequireAuth>
                <Verify />
              </RequireAuth>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
