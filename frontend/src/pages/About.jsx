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
Videos can be taken out of their original context, altered to change meaning, stolen and re-uploaded under another name, or fabricated entirely. When these versions spread online, it becomes difficult, and often impossible, for audiences, journalists, organisations or platforms to know which source to trust. ClipCert solves this by letting content creators, journalists, public figures, publishers or anyone cryptographically sign their content. This signature survives partial edits, reordering, or redistribution, allowing anyone to verify that the material genuinely came from the stated source.          
		  </p>



        <p className="mb-4 text-white">
				<h2 className="text-2xl font-semibold mb-4">The mission</h2>
ClipCert’s mission is to make video origin and authenticity verification a standard part of publishing. By linking each signed video to the signer’s public identity, it becomes straightforward to confirm what is official and challenge anything that is not whether that’s a manipulated interview, a stolen and misattributed clip, a forged campaign message, or an AI-generated imitation.
  </p>

		<h2 className="text-2xl font-semibold mb-4">The long-term vision</h2>
        <p className="mb-4 text-white">
ClipCert aims to help establish an industry standard for cryptographically signed digital content, much like how TLS and Certificate Authorities secure the web. Publishers, content creators, individuals and organisations could make it known on their social channels and websites that their videos are certified by ClipCert, simply by displaying their ClipCert username. This would allow anyone to quickly verify whether a video came from them or if it has been altered, misattributed, or fabricated.
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
ClipCert doesn’t try to detect fakes or use AI. Instead, it uses a secure digital “signature” to link your video to you at the moment you submit it. That signature is tied to your ClipCert username, so later on, anyone can check a video against your username to confirm it really came from you.
     </p>
    </div>
	
	

<div className="w-full max-w-3xl text-white mb-16">
<h2 className="text-2xl font-semibold mb-4">About Me</h2>
<p>
I’m an integration engineer by profession, working within the NHS. This is a side project driven by my interest in how technology can help protect authenticity and content ownership online. Over time, I’ve seen how easily videos can be misrepresented, misattributed, or manipulated, and how hard it can be to prove what’s genuine.
I built ClipCert to explore whether a straightforward, cryptographic approach, allowing people to sign their content so it can later be independently verified, could help address these challenges and make trust in digital video easier to maintain.
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
