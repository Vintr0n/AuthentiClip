export default function Demo() {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-y-auto py-10 px-4">
      
      <div className="w-full max-w-5xl text-white mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Demo</h1>

        <div className="w-full aspect-w-16 aspect-h-9">
          <iframe 
  width="900" 
  height="450" 
  src="https://www.youtube.com/embed/YL--qn4iWZ8?vq=hd720" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; 
  autoplay; 
  clipboard-write; 
  encrypted-media; 
  gyroscope; 
  picture-in-picture; 
  web-share" allowfullscreen></iframe>
        </div>
      </div>

    </div>
  );
}


