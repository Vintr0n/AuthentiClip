import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Header from './components/Header';

import About from './pages/About';
import POC from './pages/POC';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UploadVideo from './pages/UploadVideo';
import Verify from './pages/Verify';
import Feedback from './pages/Feedback';
import VerifyEmail from './pages/VerifyEmail';
import FAQ from './pages/FAQ';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Demo from "./pages/Demo";
import Contact from "./pages/Contact";


export default function App() {
  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-sky-300 to-blue-600 text-white flex flex-col overflow-auto">
      <Header />
      <main className="flex-grow flex justify-center items-center px-4">
        <Routes>
          <Route path="/" element={<Navigate to="/demo" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/poc" element={<POC />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
<Route path="/FAQ" element={<FAQ />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/demo" element={<Demo />} />
<Route path="/contact" element={<Contact />} />

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
		  <Route
  path="/feedback"
  element={
    <RequireAuth>
      <Feedback />
    </RequireAuth>
  }
/>

        </Routes>
      </main>
    </div>
  );
}