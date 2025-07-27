import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import RequireAuth from './components/RequireAuth';
import Header from './components/Header';

import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadVideo from './pages/UploadVideo';
import Verify from './pages/Verify';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen h-screen bg-gradient-to-br from-sky-300 to-blue-600 text-white flex flex-col overflow-hidden">
          <Header />
          <main className="flex-grow flex justify-center items-center px-4">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
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
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
