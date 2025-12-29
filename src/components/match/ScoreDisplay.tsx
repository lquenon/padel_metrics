interface ScoreDisplayProps {
  scoreUs: string;
  scoreThem: string;
  labelUs?: string;
  labelThem?: string;
}

export default function ScoreDisplay({
  scoreUs,
  scoreThem,
  labelUs = 'NOUS',
  labelThem = 'EUX',
}: ScoreDisplayProps) {
  return (
    <div className="relative w-full text-center py-4">
      <h1 className="text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
        {scoreUs}{' '}
        <span className="text-gray-500/40 mx-2 text-4xl align-middle">-</span>{' '}
        {scoreThem}
      </h1>
      <div className="flex justify-between w-full max-w-[250px] mx-auto text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
        <span>{labelUs}</span>
        <span>{labelThem}</span>
      </div>
    </div>
  );
}
