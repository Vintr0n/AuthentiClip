import { useEffect, useState } from "react";

export default function VerificationGauge({ matchPercentage, matchCount, totalFrames }) {
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = Math.round(matchPercentage);
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setDisplayedPercentage(current);
    }, 200); // adjust speed (ms between steps)
    return () => clearInterval(interval);
  }, [matchPercentage]);

  const getColor = (value) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-6 text-center">
            <h3 className="text-lg font-bold mb-2">{`Content Matched: ${matchPercentage}%`}</h3>
      <div className="relative h-8 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(matchPercentage)} transition-all duration-700`}
          style={{ width: `${matchPercentage}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-300">
        <p>{`Frames matched: ${matchCount} / ${totalFrames}`}</p>
      </div>
    </div>
  );
}
