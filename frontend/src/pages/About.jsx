import twitterImg from '../assets/twitterExample.png';
import youtubeImg from '../assets/youtubeExample.png';

export default function About() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      
      {/* Text Section */}
      <div className="w-full max-w-3xl text-white mb-16">
        <h1 className="text-3xl font-bold mb-6 text-center">ClipCert Project</h1>

        <p className="mb-4 text-white">
          This project was created in response to growing concerns about the rise of AI-generated content and its impact on truth and authenticity.
        </p>

        <p className="mb-4 text-white">
As deepfakes become more convincing and the tools to create them become widely accessible, content creators, actors, journalists and public figures face a growing challenge: proving ownership of their online content and disproving content that looks to be real, but it is not authorised by them. 
        </p>

        <p className="mb-4 text-white">
ClipCert’s mission is to promote a future where anyone can prove that their video is authentic regardless of how it’s been shared, or republished online and that any other video featuring them or their footage has been forged.
        </p>

        <p className="mb-4 text-white">
This project aims to restore clarity in a time of confusion - giving people the tools to certify what’s real, and challenge what isn’t.
        </p>

        <p className="mb-4 text-white">
The long-term vision for ClipCert is to help establish an industry standard for cryptographically signed digital content, similar to how TLS and Certificate Authorities (CAs) secure the web, ClipCert would help publishers of digital content cryptographically sign their videos and make their public keys accessible - by making them visible on their social platforms and websites. This would allow anyone to independently verify whether a video truly originated from a trusted source, or if it’s been altered, falsely attributed, or entirely fabricated.
        </p>
      </div>

      {/* Wide Image Section */}
      <div className="w-full px-4 mb-16">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <img
            src={twitterImg}
            alt="Twitter Example"
            className="rounded-lg border border-white shadow-md w-full max-w-2xl"
          />
          <img
            src={youtubeImg}
            alt="YouTube Example"
            className="rounded-lg border border-white shadow-md w-full max-w-2xl"
          />
        </div>

        <p className="text-sm text-gray-200 mt-6 text-center">
          These mockups show what it could look like if platforms supported cryptographic video verification as a public standard.
        </p>
      
</div>
    </div>
  );
}
