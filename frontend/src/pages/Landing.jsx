import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_20%,black,transparent)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">Verify videos with cryptographic confidence</h1>
              <p className="mt-4 text-lg text-white/90 max-w-prose">
                Drop a clip or paste a link from supported sites and get a fast, transparent verification result based on signed bundles. No plugins. No guesswork.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/signup" className="inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold bg-white text-sky-700 hover:bg-slate-100 transition focus:outline-none focus-visible:ring focus-visible:ring-white/50">
                  Create free account
                </Link>
                <Link to="/verifyvideo" className="inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold border border-white/60 text-white hover:bg-white/10 transition">
                  Try verify from URL
                </Link>
              </div>
              <p className="mt-3 text-xs text-white/70">Prefer uploads only. Use <Link to="/upload" className="underline underline-offset-4">Upload</Link>.</p>
            </div>

            {/* Right side card */}
            <div className="bg-[#0e131f]/90 backdrop-blur-sm rounded-2xl border border-white/15 p-6 sm:p-8 shadow-xl">
              <div className="text-sm text-white/80">How it works</div>
              <ol className="mt-3 space-y-3">
                <li className="flex gap-3">
                  <span className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-white/10 border border-white/20 font-bold">1</span>
                  <p className="text-white/90">Sign your reference footage to create an on-chain ready bundle with hashed frames and a signature.</p>
                </li>
                <li className="flex gap-3">
                  <span className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-white/10 border border-white/20 font-bold">2</span>
                  <p className="text-white/90">Anyone can submit a clip or URL. The backend downloads if allowed, samples frames, and computes perceptual hashes.</p>
                </li>
                <li className="flex gap-3">
                  <span className="h-8 w-8 shrink-0 grid place-items-center rounded-full bg-white/10 border border-white/20 font-bold">3</span>
                  <p className="text-white/90">We compare against signed bundles and return a match score plus optional thumbnails of non-matching frames.</p>
                </li>
              </ol>
              <div className="mt-6 flex gap-3">
                <Link to="/verify" className="rounded-lg px-4 py-2 text-sm font-semibold bg-white text-sky-700 hover:bg-slate-100">Verify upload</Link>
                <Link to="/about" className="rounded-lg px-4 py-2 text-sm font-semibold border border-white/20 hover:bg-white/10 text-white">Learn more</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="URL verification" body="Paste a link from supported sources like X. We fetch, sample, and verify on the server." />
          <FeatureCard title="Upload support" body="Upload short clips. We never expose your reference frames. Only hashes are compared." />
          <FeatureCard title="Cryptographic signing" body="Each bundle is signed with your key so results are tamper evident and auditable." />
        </div>
      </section>

      {/* Split CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Start verifying in minutes</h2>
              <p className="mt-2 text-white/90">No credit card required. Use a guest identity or create an account to save signed bundles.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/login" className="rounded-full px-5 py-3 text-base font-semibold border border-white/30 text-white hover:bg-white/10">Continue as guest</Link>
              <Link to="/signup" className="rounded-full px-5 py-3 text-base font-semibold bg-white text-sky-700 hover:bg-slate-100">Create account</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10 text-white/70">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/15 pt-6">
          <p className="text-sm">© {new Date().getFullYear()} ClipCert. All rights reserved.</p>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, body }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-[#0e131f]/80 p-6 shadow-xl">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-white/85">{body}</p>
    </div>
  );
}
