// frontend/src/components/VerificationGauge.jsx

export default function VerificationGauge({ matchPercentage, matchCount, totalFrames }) {
  const getColor = (value) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-bold mb-2">Match Score</h3>
      <div className="relative h-8 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(matchPercentage)} transition-all duration-700`}
          style={{ width: `${matchPercentage}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-300">
        <p>{`Content Match Score: ${matchPercentage}%`}</p>
        <p>{`Frames matched: ${matchCount} / ${totalFrames}`}</p>
      </div>
    </div>
  );
}
