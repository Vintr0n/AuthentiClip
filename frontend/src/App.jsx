export default function App() {
  return (
    <div className="min-h-screen text-white flex flex-col overflow-hidden bg-[#0e131f]">
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
  );
}
