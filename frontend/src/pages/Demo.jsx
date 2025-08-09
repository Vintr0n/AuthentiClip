// frontend/src/pages/Demo.jsx
import useIsMobile from '../hooks/useIsMobile';

export default function Demo() {
  const isMobile = useIsMobile(); // returns true if width < 768

  // Keep desktop size the same; scale down on mobile while preserving 16:9
  const desktop = { width: 900, height: 450 };
  const mobileWidth = 360; // adjust to taste (320–420 are typical)
  const mobile = { width: mobileWidth, height: Math.round((mobileWidth * 9) / 16) };

  const { width, height } = isMobile ? mobile : desktop;

  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      <div className="w-full max-w-5xl text-white mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Demo</h1>

        <div className="w-full flex justify-center">
          <iframe
            width={width}
            height={height}
            style={{ maxWidth: '100%' }}
            src="https://www.youtube.com/embed/YL--qn4iWZ8?vq=hd720"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
