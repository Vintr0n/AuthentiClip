import twitterImg from '../assets/twitterExample.png';
import youtubeImg from '../assets/youtubeExample.png';

export default function About() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      {/* Text Section */}
      <div className="w-full max-w-3xl text-white mb-16">
        <h1 className="text-3xl font-bold mb-6 text-center">ClipCert Project</h1>
        <p className="mb-6 text-white">
          This project was born out of a concern about the rise of AI-generated impersonations and their impact on truth and trust.
        </p>
        <p className="mb-4 text-white">
          As deepfakes become more convincing and widely accessible, creators face a growing challenge: proving they made what they publish — and disproving what they didn’t. Whether it’s manipulated speech, stolen likeness, or reused footage, the line between real and synthetic is rapidly blurring.
        </p>
        <p className="mb-4 text-white">
          My mission is to promote a future where anyone can prove that their video is authentic regardless of how it’s been shared, or republished online — and that any other video featuring them or their footage has been forged.
        </p>
        <p className="text-white">
          This project aims to restore clarity in a time of confusion — giving people the tools to stand behind what’s real, and challenge what isn’t.
        </p>
      </div>

      {/* Vision Section */}
      <div className="w-full max-w-3xl text-white text-center">
        <h2 className="text-2xl font-semibold mb-4">What the Future Might Look Like</h2>
        <p className="mb-6 text-white px-4">
          Imagine a standard where trusted voices — journalists, creators, or public figures — list their public verification keys directly on their social profiles. Anyone could instantly verify the origin of a video, and know with confidence whether it was real or forged.
        </p>

        {/* Images */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 px-4">
          <img src={twitterImg} alt="Twitter Example" className="rounded-lg border border-white shadow-md max-w-full md:max-w-xs" />
          <img src={youtubeImg} alt="YouTube Example" className="rounded-lg border border-white shadow-md max-w-full md:max-w-xs" />
        </div>

        <p className="text-sm text-gray-200 mt-6">
          These mockups show what it could look like if platforms supported cryptographic video verification as a public standard.
        </p>
      </div>
    </div>
  );
}
