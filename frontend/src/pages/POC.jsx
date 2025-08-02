import uploadImg from '../assets/uploadScreenshot.png';
import verifyImg from '../assets/verifyloadingScreenshot.png';
import resultImg from '../assets/verifiedScreenshot.png';

export default function POC() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      <div className="w-full max-w-4xl text-white space-y-12">
	  

        <h1 className="text-3xl font-bold text-center">Proof of Concept</h1>
		
		<div className="flex flex-col md:flex-row items-center gap-6">
		<p>ClipCert is a project in it's infancy and in order to check it's feasability we welcome you to sign up and be part of the proof of concept. The instruction below aim to guide you on how you can assist in the POC.
</p>
		</div>

        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={uploadImg} alt="Upload Example" className="rounded w-full md:w-1/2" />
          <div className="text-white md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">1. Create an Account and Upload</h2>
            <p>Sign up and upload a short video file (10 seconds max). Once uploaded, your video is cryptographically signed, enabling it to be verified by others later.
</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          <img src={verifyImg} alt="Verify Example" className="rounded w-full md:w-1/2" />
          <div className="text-white md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">2. Anyone Can Verify</h2>
            <p>Others can upload a video and verify it against a username. The system will calculate how closely the uploaded video matches the original signed footage.</p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={resultImg} alt="Result Example" className="rounded w-full md:w-1/2" />
          <div className="text-white md:w-1/2">
<h2 className="text-xl font-semibold mb-2">3. Understand the Results</h2>
<p>
  The verification result shows a percentage of authenticity, indicating how much of the submitted video matches what the original user signed. 
  A 100% match means the video is identical and untampered. For example, an 85% result suggests that 85% of the footage was verified as original, while the rest may have been altered or added.
</p>


          </div>
        </div>

        {/* Limitations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Limitations (POC only)</h2>
          <ul className="list-disc list-inside text-white space-y-2">
            <li>Only .mp4 files supported</li>
            <li>Max video length: 10 seconds</li>
            <li>Max file size: 30MB</li>
            <li>Any editing, overlays, or visual changes will reduce the verification score</li>
<li>
  Frame order or trimming does not impact verification, but encoding changes, filters, or added scenes can reduce the score. The system is designed to be resilient to technical variations while flagging meaningful edits.
</li>
<li>
  This is still a work in progress, the aim of this POC is to test it's feasability and whether or not the concept works in the real world. Technical aspects of the approach has been scaled back for maintainability and costs
</li>
          </ul>
        </div>
		
		
		        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended tests</h2>
          <ul className="list-disc list-inside text-white space-y-2">
            <li>1. Upload and digitally sign a video</li>
            <li>2a. Upload that video to another website, YouTube, Instagram, TikToc, X and redownload it (be sure to stick to website policies)</li>
            <li>2b. Veryify that video against your username (has it maintained it's match percentage?)</li>
            <li>3a. Change the frame order of that video and/or trim that video </li>
			<li>3b. Veryify the video against your username (has it maintained it's match percentage?)</li>
			<li>4a. Make additions to the video, add frames </li>
			<li>4b. Veryify the video against your username (has the matched percentage dropped as expected?)</li>
			<li>5a. Use AI to make a video the same as your video</li>
			<li>5b. Veryify the video against your username (what is the matched percentage?)</li>
          </ul>
        </div>
		

      

      </div>
    </div>
  );
}
