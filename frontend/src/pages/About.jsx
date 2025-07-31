import twitterImg from '../assets/twitterExample.png';
import youtubeImg from '../assets/youtubeExample.png';

export default function About() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      
      {/* Text Section */}
      <div className="w-full max-w-3xl text-white mb-4">
	  
        <h1 className="text-3xl font-bold mb-6 text-center">ClipCert Project</h1>

        <p className="mb-4 text-white">
		<h2 className="text-2xl font-semibold mb-4">The problem</h2>
          This project was created in response to growing concerns about the rise of AI-generated content and its impact on truth and authenticity.
        </p>

        <p className="mb-4 text-white">
As deepfakes become more convincing and the tools to create them become widely accessible, content creators, actors, journalists and public figures face a growing challenge: proving ownership of their online content and disproving content that looks to be real, but it is not authorised by them. 
        </p>

        <p className="mb-4 text-white">
				<h2 className="text-2xl font-semibold mb-4">The mission</h2>
ClipCert’s mission is to promote a future where anyone can prove that their video is authentic regardless of how it’s been shared, or republished online and that any other video featuring them or their footage has been forged.
        </p>

        <p className="mb-4 text-white">
This project aims to restore clarity in a time of confusion - giving people the tools to certify what’s real, and challenge what isn’t.
        </p>
		<h2 className="text-2xl font-semibold mb-4">The long-term vision</h2>
        <p className="mb-4 text-white">
The long-term vision for ClipCert is to help establish an industry standard for cryptographically signed digital content, similar to how TLS and Certificate Authorities (CAs) secure the web, ClipCert would help publishers of digital content cryptographically sign their videos and make their public keys accessible - by making them visible on their social platforms and websites. This would allow anyone to independently verify whether a video truly originated from a trusted source, or if it’s been altered, falsely attributed, or entirely fabricated.
        </p>
      </div>

      {/* Wide Image Section */}
      <div className="w-full px-4 mb-4">
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

        <p className="text-sm text-white-200 mt-6 text-center">
          These mockups show what it could look like if platforms supported cryptographic video verification as a public standard.
        </p>
      
</div>
<div className="w-full max-w-3xl text-white mb-4">
<h2 className="text-2xl font-semibold mb-4">How It Works</h2>
    <p>
 ClipCert does not use AI or deepfake detection. Instead, it uses traditional cryptographic methods. When you upload a video, it’s signed with your private key. Anyone can later verify that video using your username, which is linked to your public key.
        </p>
    </div>
	
	

<div className="w-full max-w-3xl text-white mb-16">
<h2 className="text-2xl font-semibold mb-4">About Me</h2>
<p>
I’m an integration engineer by profession, working within the NHS. This is a personal passion project started because of my experience using AI tools, tools I’ve found both powerful and incredibly useful. At the same time, I’ve become increasingly aware of the risks they pose to authenticity and truth, particularly around content ownership and AI-generated footage.
</p>

<p className="mt-4">
I built ClipCert to explore whether a simple, cryptographic approach, allowing people to sign their content so it can later be independently verified, could help address some of the challenges we face in the modern era of AI-generated content, video manipulation, and identity ownership.
</p>

    </div>
	
	
	
	
	
	
	
	<div className="w-full max-w-3xl text-white mb-16">
  <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>

  <p className="mb-4">
    <strong>1. Provenance of Authentic Content</strong><br />
    <span className="block mt-1">
      <strong>Use Case:</strong> A journalist films an interview in a conflict zone. Someone later uploads a manipulated version that portrays the subject differently.
    </span>
    <span className="block mt-1">
      <strong>ClipCert Solution:</strong> By cryptographically signing the original footage, the journalist can prove the version they uploaded is genuine, and that the edited version is a forgery.
    </span>
  </p>

  <p className="mb-4">
    <strong>2. Combating Politician Deepfakes</strong><br />
    <span className="block mt-1">
      <strong>Use Case:</strong> A deepfake of a politician making inflammatory remarks goes viral before an election.
    </span>
    <span className="block mt-1">
      <strong>ClipCert Solution:</strong> The politician's team can release a signed statement that only videos published on verified channels and signed with their known key are authentic. Media outlets and platforms could use the public key to verify the content.
    </span>
  </p>

  <p className="mb-4">
    <strong>3. Defending Content Ownership</strong><br />
    <span className="block mt-1">
      <strong>Use Case:</strong> A YouTuber's original footage is stolen, edited, and re-uploaded under someone else's name to damage their reputation.
    </span>
    <span className="block mt-1">
      <strong>ClipCert Solution:</strong> The YouTuber can show that their original version was cryptographically signed and timestamped, establishing precedence and authorship.
    </span>
  </p>

  <p className="mb-4">
    <strong>4. Combating Actor Identity Issues</strong><br />
    <span className="block mt-1">
      <strong>Use Case:</strong> A new trailer emerges which features a famous actor and is getting a lot of traction, but the source is unknown — raising concerns about whether it’s legitimate or AI-generated.
    </span>
    <span className="block mt-1">
      <strong>ClipCert Solution:</strong> As part of their contractual agreements, high-profile actors decide all officially sanctioned footage featuring them be cryptographically signed through a designated publisher or production house. This creates a clear standard: if it's not signed, it's not real. All public-facing content can be independently verified as authentic. This protects actors from unauthorized or AI-generated misuse of their likeness and provides distributors, platforms, and audiences with a consistent method of verification.
    </span>
  </p>
</div>
</div>
  );
}
