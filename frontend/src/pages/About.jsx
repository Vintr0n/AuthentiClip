import twitterImg from '../assets/twitterExample.png';
import youtubeImg from '../assets/youtubeExample.png';

export default function About() {
  return (
    <div className="flex justify-center min-h-screen overflow-y-auto items-start mt-10 px-4">
      <div className="w-full sm:max-w-2xl bg-[#0e131f] border border-slate-700 p-10 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4 text-center">About This Project</h1>
        <p className="mb-6 text-gray-300">
          This project was born out of a concern about the rise of AI-generated impersonations and their
          impact on truth and trust.
        </p>
        <p className="mb-4 text-gray-300">
          As deepfakes become more convincing and widely accessible, creators face a growing challenge: 
		  proving they made what they publish — and disproving what they didn’t. 
        </p>
        <p className="mb-4 text-gray-300">
          My mission is to promote a future where anyone can prove that their video is authentic 
		  regardless of how it’s been shared, or republished online and that any other video featuring them or their footage has been forged.
        </p>
        <p className="text-gray-300">
		          This isn’t just about technology — it's about protecting identity, accountability,
          and truth in an increasingly synthetic digital world.
          This project aims to restore clarity in a time of confusion — giving people the tools to stand behind what’s real, and challenge what isn’t.
        </p>
		  <p className="mb-4 text-gray-300">
          Imagine a standard where trusted voices — journalists, content creators, or public figures — list their
          public verification keys directly on their social profiles. Anyone could instantly verify the origin
          of a video, and know with confidence whether it was real or forged.
        </p>

        <div className="mb-6">
          <img src={twitterImg} alt="Twitter Example" className="w-full rounded-lg border border-slate-600 mb-4" />
          <img src={youtubeImg} alt="YouTube Example" className="w-full rounded-lg border border-slate-600" />
        </div>

        <p className="text-sm text-gray-500 text-center">
          These mockups show what it could look like if platforms supported cryptographic video verification
          as a public standard.
        </p>
      </div>
    </div>
  );
}
