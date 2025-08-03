import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "Q: Isn’t it proof enough when an official account posts the video?",
      answer: `Independent and Durable Verification
• With cryptographic signing, the video’s authenticity can be verified anywhere, by anyone — even if the original site goes offline, the original account disappears or platform policies change. If those verification systems are sold, compromised, or manipulated, trust is broken. ClipCert’s method uses cryptographic keys that can’t be bought or impersonated.
Platform-Locked Trust
• Verification (like blue checks or timestamps) is only meaningful within that platform.
• Once content is downloaded or shared elsewhere, that trust doesn't follow.

Tamper-Proof
• Even a single-frame change would affect the verification score. This helps prove a video hasn’t been tampered with. To compare that on a video that has been shared with you, on a social media platform or app, you would have to scrub through and hope to find the subtle changes.

Useful for Legal, Archival, or News Contexts
• ClipCert’s approach creates strong, independent proof of authorship and content integrity — suitable for journalism, digital rights, or evidence handling.

An analogy, if you’ll humour me:
Think of a signet ring used by royalty or nobility. It bore a unique engraving and was pressed into hot wax to seal official documents.
The seal proved who sent it — and if the wax was broken or altered, the tampering was obvious.
ClipCert does the same — cryptographic signatures “seal” your video. Anyone, anywhere, can verify it’s genuine and unchanged.

In contrast, a social media post is more like receiving a letter with a printed return address and a company logo on the envelope.
Sure, you might believe it came from that sender — if you trust the platform, if the account wasn’t compromised, and if the post hasn’t been deleted.
But once the envelope is opened (the video is downloaded or reshared), that return address doesn’t help anymore.

TLDR:
ClipCert helps shift trust from centralized platforms to cryptographic proof — enabling long-lasting, platform-independent, verifiable authenticity that travels with the content.`
    },
    {
      question: "Q: Does the order of the video matter?",
      answer: "No. If someone rearranges scenes or cuts the video differently, but the underlying frames are unchanged, that video will still verify correctly. Frame order doesn’t affect verification."
    },
    {
      question: "Q: Can it tell me which frames didn’t match?",
      answer: "Not currently, this has been considered and it is a desire to add a display of which frames didn’t match to future developments"
    },
    {
      question: "Q: Can I search for other users?",
      answer: "Not as part of this proof of concept. However, building a searchable, verifiable directory of public users is something we’re exploring as part of a decentralized trust network."
    },
    {
      question: "Q: If I just add a filter or resize the video, will it still verify?",
      answer: "No,  even small visual changes like filters, cropping, resizing, or compression will affect the verification score. ClipCert relies on exact frame-level integrity. Any change — even subtle — alters the video’s digital fingerprint."
    },
    {
      question: "Q: Does ClipCert store my video?",
      answer: "No, ClipCert does not store the video itself. Only a cryptographic summary (digital signature) is saved. This allows the system to verify the video without keeping the original content."
    },
    {
      question: "Q: Can I delete videos I’ve uploaded?",
      answer: "Not in this current proof of concept. Deletion and user-side content management will be part of future development"
    },
    {
      question: "Q: Can anyone else verify my videos?",
      answer: "Yes, verification is public. Anyone with your public key (username) and video (even if they download it from a different source) can verify its authenticity without needing access to your account."
    },
    {
      question: "Q: Can I prove that I’m the original creator of a video?",
      answer: `No, ClipCert can prove that you signed a video, but it can’t prove you were the first or original creator.
If two people upload the same video, both will have valid signatures showing they signed it — but ClipCert doesn’t track who did it first.
It guarantees authorship of a specific version, not originality of the content itself.
That said, proving originality isn’t ClipCert’s core goal. The platform is focused on authenticity and trust, helping viewers verify who a video came from and whether it was altered.
So, even if someone gets hold of leaked movie footage and signs it with ClipCert, it would still not come from an official identity or trusted public key.
Trust comes from known publishers, not just who pressed the "sign" button first.`
    },
    {
      question: "Q: What happens if someone reposts my verified video?",
      answer: "The cryptographic signature still holds. As long as the video hasn’t been altered, anyone can independently verify that it was originally signed by you."
    },
    {
      question: "Q: What happens if I compress my video before uploading?",
      answer: "Compression changes frame data, which affects verification. For best results, upload unaltered or minimally processed footage."
    },
    {
      question: "Q: Do I need to record or upload the entire video in one go?",
      answer: "No, ClipCert works on the frame level. You can upload multiple clips separately, but each upload is treated as its own verifiable asset."
    },
    {
      question: "Q: Where is my private key stored?",
      answer: "In this proof of concept, it’s securely generated and stored server-side. In future versions, users may be able to export or manage their own keys for greater control."
    },
    {
      question: "Q: Can someone fake my identity if they know my email?",
      answer: "No, only your private cryptographic key can sign a video. Email is used for account setup and verification, but it doesn’t prove authorship on its own."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div className="flex flex-col w-full items-center min-h-screen overflow-y-auto py-10 px-4">
      <div className="w-full max-w-5xl text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border-b border-gray-700 pb-2">
            <button
              onClick={() => toggle(index)}
              className="text-left w-full text-xl font-semibold focus:outline-none hover:text-blue-900 transition-colors"
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <p className="mt-2 text-white text-base leading-relaxed whitespace-pre-wrap">{faq.answer}</p>

            )}
          </div>
        ))}
      </div>
    </div>
  );
}
