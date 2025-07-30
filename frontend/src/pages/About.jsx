import twitterImg from '../assets/twitterExample.png';
import youtubeImg from '../assets/youtubeExample.png';
import logo from '../assets/logo-squared.png.png';

export default function About() {
  return (
    <div className="min-h-screen w-full overflow-y-auto px-4 py-12 bg-gradient-to-br from-sky-300 to-blue-600 text-white font-poppins">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">

        {/* Logo and Branding */}
        <img src={logo} alt="ClipCert Logo" className="w-24 h-24 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold">ClipCert</h1>
        <p className="text-lg text-slate-100 max-w-3xl leading-relaxed">
          This project was born out of a concern about the rise of AI-generated impersonations and their impact on truth and trust.
        </p>

        {/* Problem Statement */}
        <section className="text-left w-full space-y-6">
          <h2 className="text-2xl font-semibold">Why This Matters</h2>
          <p className="text-slate-100 leading-relaxed">
            As deepfakes become more convincing and widely accessible, creators face a growing challenge:
            proving they made what they publish — and disproving what they didn’t. Whether it’s manipulated
            speech, stolen likeness, or reused footage, the line between real and synthetic is rapidly blurring.
          </p>
          <p className="text-slate-100 leading-relaxed">
            My mission is to promote a future where anyone can prove that their video is authentic regardless
            of how it’s been shared or republished — and that any other video featuring them or their footage
            has been forged.
          </p>
          <p className="text-slate-100 leading-relaxed">
            This project aims to restore clarity in a time of confusion — giving people the tools to stand
            behind what’s real, and challenge what isn’t.
          </p>
        </section>

        {/* Vision with Mockups */}
        <section className="w-full text-center mt-12 space-y-6">
          <h2 className="text-2xl font-semibold">What the Future Might Look Like</h2>
          <p className="text-slate-100 max-w-3xl mx-auto">
            Imagine a standard where trusted voices — journalists, creators, or public figures — list their
            public verification keys directly on their social profiles. Anyone could instantly verify the origin
            of a video, and know with confidence whether it was real or forged.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
            <img
              src={twitterImg}
              alt="Twitter Mockup"
              className="rounded-xl border border-white shadow-lg max-w-md"
            />
            <img
              src={youtubeImg}
              alt="YouTube Mockup"
              className="rounded-xl border border-white shadow-lg max-w-md"
            />
          </div>

          <p className="text-sm text-slate-200 mt-4">
            These mockups show what it could look like if platforms supported cryptographic video verification as a public standard.
          </p>
        </section>
      </div>
    </div>
  );
}
