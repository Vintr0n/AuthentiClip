import uploadImg from '../assets/uploadScreenshot.png';
import verifyImg from '../assets/uploadScreenshot.png';
import resultImg from '../assets/uploadScreenshot.png';

export default function POC() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      <div className="w-full max-w-4xl text-white space-y-12">

        <h1 className="text-3xl font-bold text-center">Proof of Concept</h1>

        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={uploadImg} alt="Upload Example" className="rounded shadow-md w-full md:w-1/2" />
          <div className="text-white md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">1. Create an Account and Upload</h2>
            <p>Sign up and upload a short video file (10 seconds max). Once uploaded, your video is cryptographically signed, enabling it to be verified by others later.
</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          <img src={verifyImg} alt="Verify Example" className="rounded shadow-md w-full md:w-1/2" />
          <div className="text-white md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">2. Anyone Can Verify</h2>
            <p>Others can upload a video and verify it against your username. The system will calculate how closely the uploaded video matches your original signed footage.</p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={resultImg} alt="Result Example" className="rounded shadow-md w-full md:w-1/2" />
          <div className="text-white md:w-1/2">
<h2 className="text-xl font-semibold mb-2">3. Understand the Results</h2>
<p>
  The verification result shows a percentage of authenticity, indicating how much of the submitted video matches what the original user signed. 
  A 100% match means the video is identical and untampered. For example, an 85% result suggests that 85% of the footage was verified as original, while the rest may have been altered or added.
</p>


          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Roadmap</h2>
          <ul className="list-disc list-inside text-white space-y-2">
            <li>Search for users</li>
            <li>Highlight scenes that failed verification</li>
          </ul>
        </div>

        {/* Limitations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Limitations (POC only)</h2>
          <ul className="list-disc list-inside text-white space-y-2">
            <li>Only .mp4 and .mov files supported</li>
            <li>Max video length: 10 seconds</li>
            <li>Max file size: 200MB</li>
            <li>Any editing, overlays, or visual changes will reduce the verification score</li>
<li>
  Frame order or trimming does not impact verification, but encoding changes, filters, or added scenes can reduce the score. The system is designed to be resilient to technical variations while flagging meaningful edits.
</li>
          </ul>
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-white">
            ClipCert does not rely on AI or deepfake detection. Instead, it uses traditional cryptographic techniques.
            When a video is uploaded, a perceptual hash is signed with a private key. Anyone can later verify that video
            using the creator's public key.

ClipCert is not making use of AI based technology, ClipCert is not using AI to identify AI or other similar projects. ClipCert uses traditional methods of certification - upon video upload videos are digitally and cryptographically signed with a private key, the public key is then used in the verification process. 
          </p>
        </div>

      </div>
    </div>
  );
}
